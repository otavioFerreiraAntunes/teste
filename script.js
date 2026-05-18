/**
 * BARBEARIA - SCRIPT PROFISSIONAL
 * Arquitetura: Módulos encapsulados baseados em Eventos.
 * Funcionalidades: Controle de Menu Mobile, Scroll Suave, Geração Dinâmica de Horários e Integração com WhatsApp.
 */

"use strict";

// Configurações Globais do Sistema
const CONFIG = {
  whatsappNumber: "19982310381", // Substitua pelo número real da barbearia (com DDD)
  businessHours: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
};

// Inicialização do App assim que o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  init() {
    this.cacheDOM();
    this.bindEvents();
    this.renderTimeSlots();
    this.updateFooterYear();
  },

  cacheDOM() {
    this.form = document.getElementById("agendamento-form");
    this.horariosGrid = document.getElementById("horarios-grid");
    this.navToggle = document.querySelector(".nav-toggle");
    this.mobileMenu = document.getElementById("mobile-menu");
    this.footerYear = document.getElementById("footer-year");
    this.formError = document.getElementById("form-error");
    this.formErrorText = document.getElementById("form-error-text");
    this.allLinks = document.querySelectorAll('a[href^="#"]');
  },

  bindEvents() {
    // Menu Mobile
    if (this.navToggle) {
      this.navToggle.addEventListener("click", () => this.toggleMobileMenu());
    }

    // Fechar menu mobile ao clicar em um link interno + Scroll Suave
    this.allLinks.forEach(link => {
      link.addEventListener("click", (e) => this.handleNavigation(e));
    });

    // Validação e Envio do Formulário
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }
  },

  /**
   * 1. CONTROLE DO MENU MOBILE (Acessibilidade ativa)
   */
  toggleMobileMenu() {
    const isExpanded = this.navToggle.getAttribute("aria-expanded") === "true";
    
    this.navToggle.setAttribute("aria-expanded", !isExpanded);
    this.navToggle.classList.toggle("nav-toggle--active"); // Caso queira animar o hambúrguer no CSS
    
    if (isExpanded) {
      this.mobileMenu.setAttribute("hidden", "");
      this.mobileMenu.style.display = "none";
    } else {
      this.mobileMenu.removeAttribute("hidden");
      this.mobileMenu.style.display = "block";
    }
  },

  closeMobileMenu() {
    this.navToggle.setAttribute("aria-expanded", "false");
    this.mobileMenu.setAttribute("hidden", "");
    this.mobileMenu.style.display = "none";
  },

  /**
   * 2. NAVEGAÇÃO E SCROLL SUAVE
   */
  handleNavigation(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      this.closeMobileMenu();
      
      // Scroll suave nativo e performático
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  },

  /**
   * 3. RENDERIZAÇÃO DINÂMICA DOS HORÁRIOS
   * Cria os seletores no mesmo padrão de design (option-card) do seu HTML/CSS
   */
  renderTimeSlots() {
    if (!this.horariosGrid) return;

    this.horariosGrid.innerHTML = CONFIG.businessHours.map((horario, index) => `
      <label class="option-card option-card--sm">
        <input type="radio" name="horario" value="${horario}" required />
        <span class="option-card__content">
          <span class="option-card__title">${horario}</span>
        </span>
        <span class="option-card__check" aria-hidden="true">✓</span>
      </label>
    `).join("");
  },

  /**
   * 4. VALIDAÇÃO ROBUSTA E INTEGRAÇÃO WHATSAPP
   */
  handleFormSubmit(e) {
    e.preventDefault();
    
    // Captura os dados selecionados usando FormData API (limpo e profissional)
    const formData = new FormData(this.form);
    const unidade = formData.get("unidade");
    const barbeiro = formData.get("barbeiro");
    const servico = formData.get("servico");
    const horario = formData.get("horario");

    // Validação customizada para substituir o comportamento nativo do navegador (novalidate)
    if (!unidade || !barbeiro || !servico || !horario) {
      this.showValidationError("Por favor, selecione todas as opções (Unidade, Barbeiro, Serviço e Horário) para concluir seu agendamento.");
      return;
    }

    this.hideValidationError();

    // Construção da mensagem estruturada para o WhatsApp
    const textoMensagem = encodeURIComponent(
      ` *NOVO AGENDAMENTO* \n\n` +
      `Olá! Gostaria de confirmar meu horário de atendimento:\n\n` +
      `*Unidade:* ${unidade}\n` +
      `*Barbeiro:* ${barbeiro}\n` +
      `*Serviço:* ${servico}\n` +
      `*Horário:* ${horario}\n\n` +
      `Aguardando confirmação de disponibilidade`
    );

    // Redirecionamento seguro para API do WhatsApp (Funciona em Mobile e Desktop)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${textoMensagem}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  },

  showValidationError(message) {
    if (this.formError) {
      this.formErrorText.textContent = message;
      this.formError.removeAttribute("hidden");
      this.formError.style.display = "flex"; // Força exibição alinhada ao padrão do CSS
      this.formError.focus();
    }
  },

  hideValidationError() {
    if (this.formError) {
      this.formError.setAttribute("hidden", "");
      this.formError.style.display = "none";
    }
  },

  /**
   * 5. MANUTENÇÃO AUTOMÁTICA DO ANO DO FOOTER
   */
  updateFooterYear() {
    if (this.footerYear) {
      this.footerYear.textContent = new Date().getFullYear();
    }
  }
};