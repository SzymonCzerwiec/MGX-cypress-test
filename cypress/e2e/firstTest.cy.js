describe('Test with backend', () => {

  beforeEach('login to applicatiopn', () => {
    cy.intercept({method:'Get', path: 'tags'}, {fixture: 'tags.json'})
    cy.loginToApplication();
  });

  it('Verify correct request and response', () => {

    cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles')

    cy.contains('New Article').click()
    cy.get('[placeholder="Article Title"]').type('Test Article');
    cy.get('[formcontrolname="description"]').type('This is about testing API')
    cy.get('[formcontrolname="body"]').type('Testing API is a buttleneck for me and this is why we are here')
    cy.get('[placeholder="Enter tags"]').type('#APItesting')
    cy.contains('Publish Article').click();

    cy.wait('@postArticles').then( xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('Testing API is a buttleneck for me and this is why we are here')
      expect(xhr.response.body.article.description).to.equal('This is about testing API')
    })
  })

  it.only('Intercepting and modyfying request and response', () => {

 //lapanie requesta i modyfikowanie go
    // cy.intercept('POST', '**/articles', (req) => {
    //   req.body.article.description =  "This is a description set by US"
    // }).as('postArticles')

    //
    cy.intercept('POST', '**/articles', (req) => {
      req.reply(res => {
        expect(req.body.article.description).to.equal('This is about testing API')
        req.body.article.description = "This is a description set by US"
      })
    }).as('postArticles')

    cy.contains('New Article').click()
    cy.get('[placeholder="Article Title"]').type('Test123554');
    cy.get('[formcontrolname="description"]').type('This is about testing API')
    cy.get('[formcontrolname="body"]').type('Testing API is a buttleneck for me and this is why we are here')
    cy.get('[placeholder="Enter tags"]').type('#APItesting')
    cy.contains('Publish Article').click();

    cy.wait('@postArticles').then( xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('Testing API is a buttleneck for me and this is why we are here')
      expect(xhr.response.body.article.description).to.equal('This is a description set by US')
    })
  })

  it('intercepting and modfying request and response', () => {

    cy.intercept('POST', '**/articles/').as('postArticles')

    cy.contains('New Article').click()
    cy.get('[placeholder="Article Title"]').type('Test');
    cy.get('[formcontrolname="description"]').type('This is about testing API')
    cy.get('[formcontrolname="body"]').type('Testing API is a buttleneck for me and this is why we are here')
    cy.get('[placeholder="Enter tags"]').type('#APItesting')
    cy.contains('Publish Article').click();

    cy.wait('@postArticles').then( xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('Testing API is a buttleneck for me and this is why we are here')
      expect(xhr.response.body.article.description).to.equal('This is about testing API')
    })
  })

  it('Verify pop[ular tags are displayed', () => {
    cy.log('we logged in')
    cy.get('[class="tag-list"]').should('contain', 'Cypress').and('contain', 'Automation').and('contain', 'testing')

  })

  it('Verfy global feeds like count', () => {
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', {"articles":[],"articlesCount":0})
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0*', {fixture: 'likecounter.json'})
    cy.get('app-article-list button').then(heartList => {
      expect(heartList[0]).to.contain('1')
      expect(heartList[1]).to.contain('5')
    })

    cy.fixture('likecounter.json').then(file => {
      const articleLink = file.articles[1].slug
      file.articles[1].favoritesCount = 6
      cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/'+articleLink+'/favorite', file)
    })
    cy.get('app-article-list button').eq(1).click().should('contain', '6')
  })


  it('Verfy global feeds like count', () => {
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', {"articles":[],"articlesCount":0})
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0*', {fixture: 'author.json'})
    cy.get('[class="author"]').contains('Dupa Dupa')
    })

  })

