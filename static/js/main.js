/**
 * JavaScript principal para o Analisador de Avarias
 * Funcionalidades: monitoramento de progresso, alertas, animações, etc.
 */

// Configurações globais otimizadas
const CONFIG = {
  progressUpdateInterval: 2000, // 2 segundos - reduzido para menor carga
  alertAutoHideTime: 4000, // 4 segundos
  animationDelay: 50, // 50ms entre animações - mais rápido
  maxRetries: 2, // Reduzido tentativas
  retryDelay: 1500, // Delay menor
  debounceDelay: 300, // Para inputs de busca
  throttleDelay: 100, // Para scroll events
};

// Estado global da aplicação
const APP_STATE = {
  isProcessing: false,
  currentModal: null,
  progressTimer: null,
  retryCount: 0,
  startTime: null,
  allowModalManagement: true, // Flag para controlar se deve gerenciar modais
};

/**
 * Inicialização da aplicação
 */
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
  setupAnimations();
});

/**
 * Inicialização da aplicação - otimizada
 */
function initializeApp() {
  console.log("🚀 Inicializando Analisador de Avarias...");

  // Detectar se estamos em páginas específicas que gerenciam seus próprios modais
  const currentPage = window.location.pathname;
  if (
    currentPage.includes("/visualizar_relatorio") ||
    currentPage.includes("/editar_dados")
  ) {
    APP_STATE.allowModalManagement = false;
    console.log(
      "🔒 Gerenciamento de modal desabilitado para página específica"
    );
  }

  // Usar requestIdleCallback para inicializações não críticas
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      setupBootstrapComponents();
      checkProcessingStatus();
    });
  } else {
    setTimeout(() => {
      setupBootstrapComponents();
      checkProcessingStatus();
    }, 100);
  }

  console.log("✅ Aplicação inicializada com sucesso");
}

/**
 * Configura componentes Bootstrap de forma otimizada
 */
function setupBootstrapComponents() {
  // Tooltips - lazy loading
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  if (tooltipTriggerList.length > 0) {
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl, {
        trigger: "hover focus",
        delay: { show: 300, hide: 100 },
      });
    });
  }

  // Popovers - lazy loading
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  if (popoverTriggerList.length > 0) {
    popoverTriggerList.forEach((popoverTriggerEl) => {
      new bootstrap.Popover(popoverTriggerEl, {
        trigger: "hover focus",
        delay: { show: 300, hide: 100 },
      });
    });
  }
}

/**
 * Configura os event listeners globais
 */
function setupEventListeners() {
  // Prevenir múltiplos cliques em botões de processamento
  const processButtons = document.querySelectorAll(
    '[id*="process"], [class*="process"]'
  );
  processButtons.forEach((btn) => {
    btn.addEventListener("click", debounce(handleProcessClick, 1000));
  });

  // Configurar escape key para fechar modais
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      APP_STATE.currentModal &&
      APP_STATE.allowModalManagement
    ) {
      APP_STATE.currentModal.hide();
    }
  });

  // Configurar auto-refresh para páginas específicas
  if (window.location.pathname === "/") {
    startAutoRefresh();
  }

  // Configurar tratamento de erros globais
  window.addEventListener("error", handleGlobalError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
}

/**
 * Configura animações e efeitos visuais - otimizado
 */
function setupAnimations() {
  // Usar Intersection Observer para melhor performance
  if ("IntersectionObserver" in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;

          // Usar requestAnimationFrame para suavidade
          requestAnimationFrame(() => {
            element.classList.add("animate__animated", "animate__fadeInUp");
          });

          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observar apenas elementos visíveis
    const elementsToAnimate = document.querySelectorAll(
      ".card:not(.animated), .alert:not(.animated)"
    );
    elementsToAnimate.forEach((el) => {
      observer.observe(el);
    });
  }
}

/**
 * Verifica se há processamento em andamento - otimizado
 */
function checkProcessingStatus() {
  // Usar AbortController para cancelar requests se necessário
  const controller = new AbortController();

  fetch("/status", {
    signal: controller.signal,
    cache: "no-cache",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      if (data.progresso > 0 && data.progresso < 100) {
        APP_STATE.isProcessing = true;
        monitorarProgresso();
      }
    })
    .catch((error) => {
      if (error.name !== "AbortError") {
        console.warn("Não foi possível verificar status:", error);
      }
    });
}

/**
 * Manipula cliques em botões de processamento
 */
function handleProcessClick(event) {
  const button = event.target.closest("button");
  if (!button || APP_STATE.isProcessing) return;

  const originalText = button.innerHTML;
  const originalDisabled = button.disabled;

  // Feedback visual imediato
  button.innerHTML =
    '<i class="bi bi-hourglass-split spin me-2"></i>Iniciando...';
  button.disabled = true;

  // Restaurar estado após 3 segundos se não houver resposta
  setTimeout(() => {
    if (!APP_STATE.isProcessing) {
      button.innerHTML = originalText;
      button.disabled = originalDisabled;
    }
  }, 3000);
}

/**
 * Monitora o progresso do processamento
 */
function monitorarProgresso() {
  APP_STATE.isProcessing = true;
  APP_STATE.startTime = Date.now();

  const progressModal = document.getElementById("progressModal");
  if (
    progressModal &&
    !APP_STATE.currentModal &&
    APP_STATE.allowModalManagement
  ) {
    APP_STATE.currentModal = new bootstrap.Modal(progressModal, {
      backdrop: "static",
      keyboard: false,
    });
    APP_STATE.currentModal.show();

    // Configurar botão de logs completos
    const viewLogsBtn = document.getElementById("viewLogsBtn");
    if (viewLogsBtn) {
      viewLogsBtn.addEventListener("click", () => {
        window.open("/logs", "_self");
      });
    }
  }
  const viewRelatorioBtn = document.getElementById("viewRelatorioBtn");
  if (viewRelatorioBtn) {
    viewRelatorioBtn.addEventListener("click", () => {
      window.open("/relatorio", "_self");
    });
  }
}

// Primeira atualização imediata
updateProgressUI({
  progresso: 0,
  status: "Conectando com servidor...",
  logs: [`🚀 Iniciando processamento às ${new Date().toLocaleTimeString()}`],
});

APP_STATE.progressTimer = setInterval(() => {
  fetch("/status")
    .then((response) => response.json())
    .then((data) => {
      updateProgressUI(data);

      if (
        data.progresso >= 100 ||
        data.status.includes("Erro") ||
        data.status.includes("concluído")
      ) {
        finalizarMonitoramento(data);
      }
    })
    .catch((error) => {
      console.error("Erro ao obter status:", error);
      APP_STATE.retryCount++;

      if (APP_STATE.retryCount >= CONFIG.maxRetries) {
        finalizarMonitoramento({
          status: "Erro de conexão",
          progresso: 0,
          logs: ["❌ Falha na comunicação com o servidor"],
        });
      }
    });
}, CONFIG.progressUpdateInterval);

/**
 * Atualiza a interface do progresso
 */
function updateProgressUI(data) {
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const progressPercent = document.getElementById("progressPercent");
  const progressStatus = document.getElementById("progressStatus");
  const progressLogs = document.getElementById("progressLogs");
  const progressTime = document.getElementById("progressTime");
  const statusIcon = document.getElementById("statusIcon");
  const statsImagens = document.getElementById("statsImagens");
  const statsTempoDecorrido = document.getElementById("statsTempoDecorrido");
  const statsETA = document.getElementById("statsETA");

  const progresso = data.progresso || 0;
  const status = data.status || "Processando...";

  // Atualizar barra de progresso
  if (progressBar) {
    progressBar.style.width = `${progresso}%`;
    progressBar.setAttribute("aria-valuenow", progresso);

    // Cores dinâmicas baseadas no progresso
    progressBar.className = "progress-bar progress-bar-striped";
    if (progresso >= 100) {
      progressBar.classList.add("bg-success");
      if (!status.includes("Erro")) {
        progressBar.classList.remove("progress-bar-animated");
      }
    } else if (status.includes("Erro")) {
      progressBar.classList.add("bg-danger", "progress-bar-animated");
    } else {
      progressBar.classList.add("bg-primary", "progress-bar-animated");
    }
  }

  // Atualizar textos de progresso
  if (progressText) progressText.textContent = `${progresso}%`;
  if (progressPercent) progressPercent.textContent = `${progresso}%`;

  // Atualizar status
  if (progressStatus) {
    progressStatus.textContent = status;
  }

  // Atualizar ícone de status
  if (statusIcon) {
    if (status.includes("Erro")) {
      statusIcon.className = "bi bi-exclamation-triangle text-danger me-2";
    } else if (progresso >= 100) {
      statusIcon.className = "bi bi-check-circle text-success me-2";
    } else {
      statusIcon.className = "bi bi-gear-fill spin text-primary me-2";
    }
  }

  // Atualizar timestamp
  if (progressTime) {
    progressTime.textContent = new Date().toLocaleTimeString();
  }

  // Atualizar logs (com cores e timestamps)
  if (progressLogs && data.logs && data.logs.length > 0) {
    // Limpar logs antigos se muitos
    if (progressLogs.children.length > 50) {
      progressLogs.innerHTML = `
        <div class="text-muted mb-2">
          <i class="bi bi-terminal me-2"></i>Console de Atividade
        </div>
      `;
    }

    const newLogs = data.logs.slice(Math.max(0, data.logs.length - 10)); // Últimos 10 logs
    newLogs.forEach((log, index) => {
      // Verificar se o log já existe para evitar duplicatas
      const existingLogs = Array.from(progressLogs.children);
      const logExists = existingLogs.some((el) => el.textContent.includes(log));

      if (!logExists) {
        const logEntry = document.createElement("div");
        const timestamp = new Date().toLocaleTimeString();

        // Determinar cor baseada no conteúdo
        let logClass = "text-light";
        if (log.includes("✅") || log.includes("concluído")) {
          logClass = "text-success";
        } else if (log.includes("❌") || log.includes("Erro")) {
          logClass = "text-danger";
        } else if (log.includes("⚠️") || log.includes("Aviso")) {
          logClass = "text-warning";
        } else if (
          log.includes("📸") ||
          log.includes("🤖") ||
          log.includes("📊")
        ) {
          logClass = "text-info";
        }

        logEntry.className = `${logClass} mb-1`;
        logEntry.innerHTML = `<small>[${timestamp}]</small> ${log}`;
        progressLogs.appendChild(logEntry);
      }
    });

    // Auto-scroll para baixo
    progressLogs.scrollTop = progressLogs.scrollHeight;
  }

  // Atualizar estatísticas
  if (APP_STATE.startTime) {
    const elapsed = Math.floor((Date.now() - APP_STATE.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    if (statsTempoDecorrido) {
      statsTempoDecorrido.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    // Calcular ETA baseado no progresso
    if (statsETA && progresso > 0 && progresso < 100) {
      const totalEstimated = (elapsed / progresso) * 100;
      const remaining = Math.max(0, totalEstimated - elapsed);
      const etaMinutes = Math.floor(remaining / 60);
      const etaSeconds = Math.floor(remaining % 60);
      statsETA.textContent = `${etaMinutes
        .toString()
        .padStart(2, "0")}:${etaSeconds.toString().padStart(2, "0")}`;
    } else if (statsETA && progresso >= 100) {
      statsETA.textContent = "Concluído!";
    }
  }

  // Estatísticas de imagens (se disponível nos dados)
  if (statsImagens && data.total_imagens) {
    const processadas = Math.floor((progresso / 100) * data.total_imagens);
    statsImagens.textContent = `${processadas}/${data.total_imagens}`;
  }
}

/**
 * Finaliza o monitoramento do progresso
 */
function finalizarMonitoramento(data) {
  APP_STATE.isProcessing = false;
  APP_STATE.retryCount = 0;

  if (APP_STATE.progressTimer) {
    clearInterval(APP_STATE.progressTimer);
    APP_STATE.progressTimer = null;
  }

  // Aguardar um momento antes de fechar o modal
  setTimeout(
    () => {
      if (APP_STATE.currentModal && APP_STATE.allowModalManagement) {
        APP_STATE.currentModal.hide();
        APP_STATE.currentModal = null;
      }

      // Mostrar resultado final
      const isSuccess = data.progresso >= 100 && !data.status.includes("Erro");
      const message = isSuccess
        ? "Processamento concluído com sucesso!"
        : `Processamento finalizado com problemas: ${data.status}`;

      showAlert(isSuccess ? "success" : "warning", message);

      // Atualizar página se necessário
      if (isSuccess && typeof atualizarStats === "function") {
        setTimeout(atualizarStats, 1000);
      }

      // Reabilitar botões de processamento
      const processButtons = document.querySelectorAll(
        '[id*="process"], [class*="process"]'
      );
      processButtons.forEach((btn) => {
        btn.disabled = false;
        btn.innerHTML = btn.innerHTML.replace(/Iniciando\.\.\./g, "Processar");
      });
    },
    isSuccess ? 2000 : 1000
  );
}

/**
 * Exibe alertas personalizados
 */
function showAlert(type, message, options = {}) {
  const {
    autoHide = true,
    hideTime = CONFIG.alertAutoHideTime,
    position = "top-right",
    dismissible = true,
  } = options;

  // Remover alertas existentes se especificado
  if (options.clearExisting) {
    document
      .querySelectorAll(".alert-floating")
      .forEach((alert) => alert.remove());
  }

  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-floating animate__animated animate__fadeInRight`;

  if (dismissible) {
    alertDiv.classList.add("alert-dismissible");
  }

  // Posicionamento
  const positionStyles = {
    "top-right":
      "position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;",
    "top-left":
      "position: fixed; top: 20px; left: 20px; z-index: 9999; max-width: 400px;",
    "bottom-right":
      "position: fixed; bottom: 20px; right: 20px; z-index: 9999; max-width: 400px;",
    "bottom-left":
      "position: fixed; bottom: 20px; left: 20px; z-index: 9999; max-width: 400px;",
  };

  alertDiv.style.cssText =
    positionStyles[position] || positionStyles["top-right"];

  // Ícones por tipo
  const icons = {
    success: "bi-check-circle-fill",
    danger: "bi-exclamation-triangle-fill",
    warning: "bi-exclamation-triangle-fill",
    info: "bi-info-circle-fill",
    primary: "bi-info-circle-fill",
  };

  const icon = icons[type] || icons.info;

  alertDiv.innerHTML = `
        <i class="bi ${icon} me-2"></i>${message}
        ${
          dismissible
            ? '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>'
            : ""
        }
    `;

  document.body.appendChild(alertDiv);

  // Auto-hide
  if (autoHide) {
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.classList.remove("animate__fadeInRight");
        alertDiv.classList.add("animate__fadeOutRight");
        setTimeout(() => alertDiv.remove(), 300);
      }
    }, hideTime);
  }

  return alertDiv;
}

/**
 * Inicia auto-refresh para estatísticas - otimizado
 */
function startAutoRefresh() {
  // Usar visibilitychange para pausar atualizações quando aba não está ativa
  let refreshInterval;

  const startRefresh = () => {
    if (refreshInterval) clearInterval(refreshInterval);

    refreshInterval = setInterval(() => {
      if (!APP_STATE.isProcessing && typeof atualizarStats === "function") {
        // Verificar se a aba está ativa antes de atualizar
        if (!document.hidden) {
          atualizarStats();
        }
      }
    }, 30000); // 30 segundos
  };

  const stopRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  };

  // Controlar refresh baseado na visibilidade da página
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopRefresh();
    } else {
      startRefresh();
    }
  });

  // Iniciar refresh se página está visível
  if (!document.hidden) {
    startRefresh();
  }
}

/**
 * Utilitário: Debounce - otimizado
 */
function debounce(func, wait = CONFIG.debounceDelay) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utilitário: Throttle - otimizado
 */
function throttle(func, limit = CONFIG.throttleDelay) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Verifica se elemento está na viewport
 */
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Formata números para exibição
 */
function formatNumber(num) {
  return new Intl.NumberFormat("pt-BR").format(num);
}

/**
 * Formata bytes para exibição
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Manipulador de erros globais
 */
function handleGlobalError(event) {
  console.error("Erro global capturado:", event.error);

  showAlert(
    "danger",
    "Ocorreu um erro inesperado. Recarregue a página se necessário.",
    {
      autoHide: false,
    }
  );
}

/**
 * Manipulador de promises rejeitadas
 */
function handleUnhandledRejection(event) {
  console.error("Promise rejeitada:", event.reason);

  if (event.reason?.message?.includes("fetch")) {
    showAlert("warning", "Problema de conexão. Verificando novamente...", {
      hideTime: 3000,
    });
  }
}

/**
 * Configuração de fetch com retry automático - otimizado
 */
function fetchWithRetry(url, options = {}, retries = CONFIG.maxRetries) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  const fetchOptions = {
    ...options,
    signal: controller.signal,
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  return fetch(url, fetchOptions)
    .then((response) => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      if (retries > 0 && error.name !== "AbortError") {
        console.warn(
          `Tentativa falhou, restam ${retries} tentativas:`,
          error.message
        );
        return new Promise((resolve) =>
          setTimeout(
            () => resolve(fetchWithRetry(url, options, retries - 1)),
            CONFIG.retryDelay
          )
        );
      }
      throw error;
    });
}

/**
 * Validação de arquivos de upload
 */
function validateFile(file) {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "text/plain"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".txt"];

  const extension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Arquivo muito grande: ${formatBytes(
        file.size
      )}. Máximo: ${formatBytes(maxSize)}`,
    };
  }

  if (
    !allowedTypes.includes(file.type) &&
    !allowedExtensions.includes(extension)
  ) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido: ${extension}`,
    };
  }

  return { valid: true };
}

/**
 * Cópia para clipboard
 */
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showAlert("success", "Copiado para a área de transferência!", {
        hideTime: 2000,
      });
    });
  } else {
    // Fallback para navegadores antigos
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showAlert("success", "Copiado para a área de transferência!", {
      hideTime: 2000,
    });
  }
}

/**
 * Exportar funções globais
 */
window.AnalisadorAvarias = {
  showAlert,
  formatNumber,
  formatBytes,
  copyToClipboard,
  validateFile,
  fetchWithRetry,
  monitorarProgresso,
  CONFIG,
  APP_STATE,
};

// Log de inicialização
console.log("📱 Analisador de Avarias - JavaScript carregado");
console.log("🔧 Utilitários disponíveis em: window.AnalisadorAvarias");
