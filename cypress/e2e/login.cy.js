/**
 * Skenario pengujian End-to-End untuk alur login
 *
 * - Login Page
 *   - should display login page correctly with all form elements
 *   - should show error message with invalid credentials
 *   - should login successfully with valid credentials and redirect to home
 *   - should navigate to register page when clicking register link
 */

describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login page correctly with all form elements', () => {
    // Verifikasi judul halaman
    cy.contains('Selamat Datang Kembali').should('be.visible');

    // Verifikasi input email dan password ada
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');

    // Verifikasi tombol submit
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Masuk');

    // Verifikasi link ke halaman register
    cy.contains('Daftar sekarang').should('be.visible');
  });

  it('should show error message with invalid credentials', () => {
    // Isi form dengan credentials yang salah
    cy.get('#email').type('wrong@email.com');
    cy.get('#password').type('wrongpassword');

    // Klik tombol login
    cy.get('button[type="submit"]').click();

    // Verifikasi error message muncul
    cy.get('.error-banner').should('be.visible');
  });

  it('should login successfully with valid credentials and redirect to home', () => {
    // Isi form dengan credentials yang benar
    // Menggunakan akun test yang sudah terdaftar di Dicoding Forum API
    cy.get('#email').type('testing12@gmail.com');
    cy.get('#password').type('testing12');

    // Klik tombol login
    cy.get('button[type="submit"]').click();

    // Verifikasi redirect ke halaman home
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);

    // Verifikasi user sudah login (tombol Keluar muncul)
    cy.contains('Keluar').should('be.visible');
  });

  it('should navigate to register page when clicking register link', () => {
    // Klik link "Daftar sekarang"
    cy.contains('Daftar sekarang').click();

    // Verifikasi sudah di halaman register
    cy.url().should('include', '/register');
    cy.contains('Buat Akun Baru').should('be.visible');
  });
});
