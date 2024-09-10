import { TableTileElements as table } from "../support/elements/table-tile"
import { ToolbarElements as toolbar } from "../support/elements/toolbar-elements"

context("case card", () => {
  beforeEach(() => {
    // cy.scrollTo() doesn't work as expected with `scroll-behavior: smooth`
    const queryParams = "?sample=mammals&mouseSensor&scrollBehavior=auto"
    const url = `${Cypress.config("index")}${queryParams}`
    cy.visit(url)
    cy.wait(2000)
  })

  const tableHeaderLeftSelector = ".codap-component.codap-case-table .component-title-bar .header-left"
  const cardHeaderLeftSelector = ".codap-component.codap-case-card .component-title-bar .header-left"

  describe("case card", () => {
    it("can switch from case table to case card view and back", () => {
      cy.get('[data-testid="codap-case-table"]').should("exist")
      cy.get('[data-testid="case-card"]').should("not.exist")
      cy.get(tableHeaderLeftSelector).click()
      cy.get(`${tableHeaderLeftSelector} .card-table-toggle-message`).click()
      cy.wait(500)
      cy.get('[data-testid="codap-case-table"]').should("not.exist")
      cy.get('[data-testid="case-card-view"]').should("exist")
      cy.get(cardHeaderLeftSelector).click()
      cy.wait(500)
      cy.get(`${cardHeaderLeftSelector} .card-table-toggle-message`).click()
      cy.get('[data-testid="codap-case-table"]').should("exist")
      cy.get('[data-testid="case-card-view"]').should("not.exist")
    })
    it("displays cases and allows user to scroll through them", () => {
      cy.get(tableHeaderLeftSelector).click()
      cy.get(`${tableHeaderLeftSelector} .card-table-toggle-message`).click()
      cy.wait(500)
      cy.get('[data-testid="case-card-view"]').should("have.length", 1)
      cy.get('[data-testid="case-card-view-title"]').should("have.text", "Cases")
      cy.get('[data-testid="case-card-view-previous-button"]').should("be.disabled")
      cy.get('[data-testid="case-card-view-next-button"]').should("not.be.disabled")
      cy.get('[data-testid="case-card-view-index"]').should("have.text", "1 of 27")
      cy.get('[data-testid="case-card-attr"]').should("have.length", 9)
      cy.get('[data-testid="case-card-attr-name"]').should("have.length", 9)
      cy.get('[data-testid="case-card-attr-value"]').should("have.length", 9)
      cy.get('[data-testid="case-card-attr-name"]').first().should("contain.text", "Mammal")
      cy.get('[data-testid="case-card-attr-value"]').first().should("have.text", "African Elephant")
      cy.get('[data-testid="case-card-view-next-button"]').click()
      cy.get('[data-testid="case-card-attr-value"]').first().should("have.text", "Asian Elephant")
      cy.get('[data-testid="case-card-view-previous-button"]').should("not.be.disabled").click()
      cy.get('[data-testid="case-card-attr-value"]').first().should("have.text", "African Elephant")
    })
    it("displays case data in a hierachy when there is a parent collection", () => {
      // make a parent collection
      table.moveAttributeToParent("Order", "newCollection")
      cy.wait(500)
      cy.get(tableHeaderLeftSelector).click()
      cy.get(`${tableHeaderLeftSelector} .card-table-toggle-message`).click()
      cy.wait(500)
      cy.get('[data-testid="case-card-view"]').should("have.length", 2)
      cy.get('[data-testid="case-card-view"]').eq(0).should("have.class", "color-cycle-1")
      cy.get('[data-testid="case-card-view"]').eq(1).should("have.class", "color-cycle-2")
      cy.get('[data-testid="case-card-view-title"]').should("have.length", 2)
      cy.get('[data-testid="case-card-view-title"]').eq(0).should("have.text", "Orders")
      cy.get('[data-testid="case-card-view-title"]').eq(1).should("have.text", "Cases")
      cy.get('[data-testid="case-card-view-previous-button"]').should("have.length", 2).and("be.disabled")
      cy.get('[data-testid="case-card-view-next-button"]').should("have.length", 2).and("not.be.disabled")
      cy.get('[data-testid="case-card-view-index"]').should("have.length", 2)
      cy.get('[data-testid="case-card-view-index"]').eq(0).should("have.text", "1 of 12")
      cy.get('[data-testid="case-card-view-index"]').eq(1).should("have.text", "1 of 2")
      cy.get('[data-testid="case-card-attrs"]').should("have.length", 2)
      cy.get('[data-testid="case-card-attrs"]').eq(0).find('[data-testid="case-card-attr"]').should("have.length", 1)
      cy.get('[data-testid="case-card-attrs"]').eq(0).find('[data-testid="case-card-attr-name"]')
                                                  .eq(0).should("contain.text", "Order")
      cy.get('[data-testid="case-card-attrs"]').eq(0).find('[data-testid="case-card-attr-value"]')
                                                  .eq(0).should("have.text", "Proboscidae")
      cy.get('[data-testid="case-card-attrs"]').eq(1).find('[data-testid="case-card-attr"]').should("have.length", 8)
      cy.get('[data-testid="case-card-attrs"]').eq(1).find('[data-testid="case-card-attr-value"]')
                                                  .eq(0).should("have.text", "African Elephant")
    })
    it("allows the user to add, edit, and hide attributes with undo/redo", () => {
      cy.get(tableHeaderLeftSelector).click()
      cy.get(`${tableHeaderLeftSelector} .card-table-toggle-message`).click()
      cy.wait(500)
      cy.get('[data-testid="case-card-attr"]').should("have.length", 9)
      cy.get('[data-testid="case-card-attr-name"]').should("have.length", 9)
      cy.get('[data-testid="case-card-attr-value"]').should("have.length", 9)

      cy.log("Add new attribute with undo/redo.")
      cy.get('[data-testid="add-attribute-button"]').click()
      cy.wait(500)
      cy.get('[data-testid="column-name-input"]').should("exist").type(" Memory{enter}")
      cy.get('[data-testid="case-card-attr-name"]').eq(9).should("contain.text", "Memory")
      cy.get('[data-testid="case-card-attr"]').should("have.length", 10)
      cy.get('[data-testid="case-card-attr-name"]').should("have.length", 10)
      cy.get('[data-testid="case-card-attr-value"]').should("have.length", 10)
      cy.get('[data-testid="case-card-attr-value"]').eq(9).click()
      cy.get('[data-testid="case-card-attr-value-text-editor"]').eq(9).should("exist").type("excellent{enter}")
      cy.get('[data-testid="case-card-attr-value"]').eq(9).should("contain.text", "excellent")

      // Undo/redo check after adding a new attribute
      toolbar.getUndoTool().click()
      toolbar.getUndoTool().click()
      toolbar.getUndoTool().click()
      cy.get('[data-testid="case-card-attr"]').should("have.length", 9)
      cy.get('[data-testid="case-card-attr-name"]').should("have.length", 9)
      toolbar.getRedoTool().click()
      toolbar.getRedoTool().click()
      toolbar.getRedoTool().click()
      cy.get('[data-testid="case-card-attr"]').should("have.length", 10)
      cy.get('[data-testid="case-card-attr-name"]').should("have.length", 10)
      cy.get('[data-testid="case-card-attr-name"]').eq(9).should("contain.text", "Memory")

      cy.log("Hide an attribute.")
      cy.get('[data-testid="case-card-attr-name"]').eq(9).click()
      cy.get('[data-testid="attribute-menu-list"]').should("be.visible")
      cy.get('[data-testid="attribute-menu-list"]').find("button").eq(9).trigger("click")
      cy.get('[data-testid="case-card-attr"]').should("have.length", 9)
      cy.get('[data-testid="case-card-attr-name"]').should("have.length", 9)
      cy.get('[data-testid="case-card-attr-value"]').should("have.length", 9)

      // Undo/redo check after hiding an attribute
      toolbar.getUndoTool().click()
      cy.get('[data-testid="case-card-attr"]').should("have.length", 10)
      toolbar.getRedoTool().click()
      cy.get('[data-testid="case-card-attr"]').should("have.length", 9)

      cy.log("Edit an attribute name with undo/redo.")
      cy.get('[data-testid="case-card-attr-name"]').eq(0).should("contain.text", "Mammal")
      cy.get('[data-testid="case-card-attr-name"]').eq(0).click()
      cy.get('[data-testid="attribute-menu-list"]').find("button").first().trigger("click")
      cy.wait(500)
      cy.get('[data-testid="column-name-input"]').type("{selectall}{backspace}Name{enter}")
      cy.get('[data-testid="column-name-input"]').should("not.exist")
      cy.get('[data-testid="case-card-attr-name"]').eq(0).should("contain.text", "Name")

      // Undo/redo check after editing an attribute name
      toolbar.getUndoTool().click()
      cy.get('[data-testid="case-card-attr-name"]').eq(0).should("contain.text", "Mammal")
      toolbar.getRedoTool().click()
      cy.get('[data-testid="case-card-attr-name"]').eq(0).should("contain.text", "Name")

      cy.log("Edit an attribute value.")
      cy.get('[data-testid="case-card-attr-value"]').eq(0).should("contain.text", "African Elephant")
      cy.get('[data-testid="case-card-attr-value"]').eq(0).click()
      cy.get('[data-testid="case-card-attr-value-text-editor"]').eq(0).type("Wooly Mammoth{enter}")
      cy.get('[data-testid="case-card-attr-value"]').eq(0).should("contain.text", "Wooly Mammoth")
      cy.get('[data-testid="case-card-attr-value"]').eq(0).click()
      cy.get('[data-testid="case-card-attr-value-text-editor"]').eq(0).type("{esc}")
      cy.get('[data-testid="case-card-attr-value"]').eq(0).should("contain.text", "Wooly Mammoth")

      // Undo/redo check after editing an attribute value
      toolbar.getUndoTool().click()
      cy.get('[data-testid="case-card-attr-value"]').eq(0).should("contain.text", "African Elephant")
      toolbar.getRedoTool().click()
      cy.get('[data-testid="case-card-attr-value"]').eq(0).should("contain.text", "Wooly Mammoth")
    })
    it("allows the user to add a new case with undo/redo", () => {
      const rootCollectionTitle = "Diets"
      table.moveAttributeToParent("Order", "newCollection")
      cy.wait(500)
      table.moveAttributeToParent("Diet", "newCollection")
      cy.wait(500)
      cy.get(tableHeaderLeftSelector).click()
      cy.get(`${tableHeaderLeftSelector} .card-table-toggle-message`).click()
      cy.wait(500)
      cy.get('[data-testid="case-card-view"]').should("have.length", 3)
      cy.log("Add new case to 'middle' collection.")
      cy.get('[data-testid="case-card-view"]').eq(1).find('[data-testid="case-card-view-index"]')
                                                 .eq(0).should("have.text", "1 of 4")
      cy.get('[data-testid="case-card-view"]').eq(1).find('[data-testid="add-case-button"]')
                                                 .eq(0).click()
      cy.get('[data-testid="case-card-view"]').eq(1).find('[data-testid="case-card-view-index"]')
                                                 .eq(0).should("have.text", "5 of 5")
      cy.get('[data-testid="case-card-view"]').eq(1).find('[data-testid="case-card-attr-value"]')
                                                 .eq(0).should("exist").click()
      cy.get('[data-testid="case-card-view"]').eq(1).find('[data-testid="case-card-attr-value-text-editor"]')
                                                 .eq(0).should("exist").type("New Order{enter}")
      cy.log("Check new case has parent and child collections' attributes and values match previously-selected case.")
      cy.get('[data-testid="case-card-view"]').eq(0).find('[data-testid="case-card-view-title"]')
                                                 .eq(0).should("have.text", rootCollectionTitle)
      cy.get('[data-testid="case-card-view"]').eq(2).find('[data-testid="case-card-attr-value"]')
                                                 .eq(0).should("have.text", "")

      // Check for undo/redo after adding a new case
      toolbar.getUndoTool().click()
      toolbar.getUndoTool().click()
      cy.get('[data-testid="case-card-view"]').eq(1).find('[data-testid="case-card-view-index"]')
                                                  .eq(0).should("have.text", "1 of 4")
      toolbar.getRedoTool().click()
      toolbar.getRedoTool().click()
      cy.get('[data-testid="case-card-view"]').eq(1).find('[data-testid="case-card-view-index"]')
                                                  .eq(0).should("have.text", "5 of 5")

      // Check for undo/redo after editing a case attribute value
      toolbar.getUndoTool().click()
      cy.get('[data-testid="case-card-view"]').eq(1).find('[data-testid="case-card-attr-value"]')
                                                  .eq(0).should("not.contain.text", "New Order")
      toolbar.getRedoTool().click()
      cy.get('[data-testid="case-card-view"]').eq(1).find('[data-testid="case-card-attr-value"]')
                                                  .eq(0).should("contain.text", "New Order")
    })
  })
})
