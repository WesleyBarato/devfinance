/// <reference types="cypress" />
import { format } from '../support/utils'

// Criando nova sequencia de testes

/* 
    ~ Entender o fluxo manualmente
    ~ Mapear os elementos que vamos interagir
    ~ Descrever as interações com o cypress
    ~ Adicionar as asserções que a gente precisa
*/
/*
    ~ Para mapear usa-se o get
    ~ npx cypress run para executar em headless e gerar um arquivo de video
    ~ npx cypress open para abrir em um navegador e executar os testes
    ~ --config viewportWidth=411, viewportHeight=823 serve para executar o cypress em uma tela de tamanho custumizado
*/
context('Dev Finances', () => {

  /* hooks
  trechos de códigos que são executados antes e depois dos testes
  before -> antes de todos os testes
  beforeEach -> antes de cada teste 
  after -> executa depois de todos os testes
  afterEach -> executa depois de cada teste */ 
  beforeEach(() => {
    cy.visit('https://devfinance-agilizei.netlify.app/');
    cy.get('#data-table tbody tr').should('have.length', 0);
})
    
  it('Cadastrar entradas', () => {

      cy.get('#transaction .button ').click(); // id e class
      cy.get('#description').type('Salário'); // id
      cy.get('[name=amount]').type(2000); // atributo
      cy.get('#date').type('2023-02-10')
      cy.get('button').contains('Salvar').click() // tipo e valor
      cy.get('#data-table tbody tr').should('have.length', 1);

  });

  it('Cadastrar saidas', () => {
    
    cy.get('#transaction .button ').click(); // id e class
      cy.get('#description').type('Computador'); // id
      cy.get('[name=amount]').type(-500); // atributo
      cy.get('#date').type('2023-02-10')
      cy.get('button').contains('Salvar').click() // tipo e valor

      cy.get('#data-table tbody tr').should('have.length', 1);
  });

  it('Remover entradas e saidas', () => {
    const saida = 'Computador'
    const entrada = 'Salario'

    cy.get('#transaction .button ').click(); // id e class
    cy.get('#description').type(entrada); // id
    cy.get('[name=amount]').type(4000); // atributo
    cy.get('#date').type('2023-02-10')
    cy.get('button').contains('Salvar').click() // tipo e valor
    cy.get('#transaction .button ').click(); // id e class
    cy.get('#description').type(saida); // id
    cy.get('[name=amount]').type(-2000); // atributo
    cy.get('#date').type('2023-02-10')
    cy.get('button').contains('Salvar').click() // tipo e valor

    // usando o elemento pai para excluir a transação
    cy.get('td.description').contains(entrada).parent()
      .find('img[onclick="Transaction.remove(0)"]').click()

    //usando os elementos irmãos para excluir a transação
    cy.get('td.description').contains(saida).siblings()
      .children('img[onclick="Transaction.remove(0)"]').click()

    cy.get('#data-table tbody tr').should('have.length', 0);

    
  });

  it.only('Validar valor total', () => {
    
    const saida = 'Computador'
    const entrada = 'Salario'

    cy.get('#transaction .button ').click(); // id e class
    cy.get('#description').type(entrada); // id
    cy.get('[name=amount]').type(400); // atributo
    cy.get('#date').type('2023-02-10')
    cy.get('button').contains('Salvar').click() // tipo e valor
    cy.get('#transaction .button ').click(); // id e class
    cy.get('#description').type(saida); // id
    cy.get('[name=amount]').type(-200); // atributo
    cy.get('#date').type('2023-02-10')
    cy.get('button').contains('Salvar').click() // tipo e valor


    let incomes = 0
    let expenses = 0

    cy.get('#data-table tbody tr')
      .each(($element, index, $list) => {
        
        cy.get($element).find('td.income, td.expense').invoke('text').then(text => {
            
            if(text.includes('-')){
              expenses = expenses + format(text)
            } else {
              incomes = incomes + format(text)
            }

            cy.log(expenses)
            cy.log(incomes)

          })

      })

      cy.get('#totalDisplay').invoke('text').then(text =>{
        
        let formattedTotalDisplay = format(text)
        let expectedTotal = incomes + expenses

        expect(formattedTotalDisplay).to.eq(expectedTotal)
      });

  });

});