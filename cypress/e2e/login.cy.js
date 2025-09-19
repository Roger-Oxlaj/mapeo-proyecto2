describe("Pruebas del Login", () => {
  // Caso 1: Login exitoso
  it("Debe loguearse correctamente con usuario válido", () => {
    cy.visit("http://localhost:3000");

    cy.get("#usuario").type("Roger");       // 👈 tu usuario válido
    cy.get("#contrasena").type("mt123");     // 👈 tu contraseña válida
    cy.get("form").submit();

    cy.url().should("include", "/mapa");    // ✅ debe redirigir al mapa
  });

  // Caso 2: Login incorrecto
  it("Debe mostrar error si la contraseña es incorrecta", () => {
    cy.visit("http://localhost:3000");

    cy.get("#usuario").type("Roger");
    cy.get("#contrasena").type("wrong");
    cy.get("form").submit();

    cy.on("window:alert", (txt) => {
      expect(txt).to.contains("incorrectos");
    });
  });

  // Caso 3: Sin usuario
  it("No debe permitir login con usuario vacío", () => {
    cy.visit("http://localhost:3000");

    cy.get("#contrasena").type("mt123");
    cy.get("form").submit();

    cy.get("#usuario:invalid"); // ✅ campo requerido
  });

  // Caso 4: Sin contraseña
  it("No debe permitir login con contraseña vacía", () => {
    cy.visit("http://localhost:3000");

    cy.get("#usuario").type("Roger");
    cy.get("form").submit();

    cy.get("#contrasena:invalid"); // ✅ campo requerido
  });

  // Caso 5: Acceso sin login
  it("Debe redirigir a login si intento entrar a /mapa sin token", () => {
    cy.visit("http://localhost:3000/mapa");

    cy.url().should("include", "/"); // ✅ protegido por middleware
  });
});