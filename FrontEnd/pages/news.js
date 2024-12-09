import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Navbar, Nav, NavDropdown, Form, FormControl, Button, Offcanvas } from 'react-bootstrap';
import { FaBars, FaSearch } from 'react-icons/fa'; // Ícones de menu hambúrguer e lupa
import { AiOutlineClose } from 'react-icons/ai'; // Ícone para limpar a pesquisa

export default function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userName, setUserName] = useState('');
  const [searchActive, setSearchActive] = useState(false); // Ativar/desativar a barra de pesquisa
  const [searchQuery, setSearchQuery] = useState(''); // Consulta de pesquisa
  const [filteredNews, setFilteredNews] = useState([]); // Notícias filtradas
  const [showSidebar, setShowSidebar] = useState(false); // Mostrar/ocultar o Offcanvas
  const searchInputRef = useRef(null); // Referência para a barra de pesquisa
  const router = useRouter();
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserName(data.login);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/news', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        const uniqueNews = removeDuplicates(data);
        setNewsItems(uniqueNews);
        setFilteredNews(uniqueNews); // Exibe todas as notícias inicialmente
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchUserName();
    fetchNews();
    fetchCategories();
  }, [router]);

  // Função para remover duplicatas com base no ID
  const removeDuplicates = (newsArray) => {
    const seen = new Set();
    return newsArray.filter((news) => {
      const duplicate = seen.has(news.id);
      seen.add(news.id);
      return !duplicate;
    });
  };

  const handleCategoryClick = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://localhost:8080/news/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch news for category');
      }
      const data = await response.json();
      const uniqueNews = removeDuplicates(data);
      setSelectedCategory(data);
      setNewsItems(uniqueNews);
      setFilteredNews(uniqueNews);
      setSearchQuery(''); // Limpa a pesquisa
      setSearchActive(false); // Desativa a barra de pesquisa
      setShowSidebar(false); // Fecha o menu lateral
      setIsSearchTriggered(false); // Restaura ao estado original
    } catch (error) {
      console.error('Error fetching news for category:', error);
    }
  };

  const handleAllNewsClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:8080/news/recent', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent news');
      }

      const data = await response.json();
      const uniqueNews = removeDuplicates(data);
      setSelectedCategory(null);
      setNewsItems(uniqueNews);
      setFilteredNews(uniqueNews);
      setSearchQuery(''); // Limpa a pesquisa
      setSearchActive(false); // Desativa a barra de pesquisa
      setIsSearchTriggered(false); // Restaura ao estado original
    } catch (error) {
      console.error('Error fetching recent news:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    setSearchQuery(query); // Atualiza o valor da busca

    if (query === '') {
      setIsSearchTriggered(false); // Se a busca estiver vazia, mostra todas as notícias
      setFilteredNews(newsItems); // Restaura todas as notícias
    } else {
      setIsSearchTriggered(true); // Marca que a busca foi disparada
      // Filtra as notícias de acordo com a busca
      const filtered = newsItems.filter(news =>
        news.title.toLowerCase().includes(query.toLowerCase()) ||
        news.summary?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  };

  const toggleSearchBar = () => {
    setSearchActive(!searchActive); // Alterna a barra de pesquisa
    if (searchActive) {
      setSearchQuery(''); // Limpa quando desativada
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar); // Alterna o menu lateral
  };

  const handleClearSearch = () => {
    setSearchQuery(''); // Limpa a consulta de pesquisa
    setFilteredNews(newsItems); // Restaura todas as notícias
    setSearchActive(false); // Desativa a barra de pesquisa
    setIsSearchTriggered(false); // Marca que a busca não está mais em andamento
  };

  // Função para renderizar os blocos de notícias em blocos de 3
  const renderNewsBlocks = (news) => {
    const newsBlocks = [];
    for (let i = 0; i < news.length; i += 3) {
      newsBlocks.push(
        <Row key={i}>
          {news.slice(i, i + 3).map((item) => (
            <Col md={4} key={item.id} className="mb-4">
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={item.imageUrl}
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title style={{ fontWeight: 'bold' }}>{item.title}</Card.Title>
                    <Card.Text>{item.summary || 'Resumo da notícia'}</Card.Text>
                    <Card.Text className="text-muted">
                      {new Date(item.publicationDate).toLocaleDateString()}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      );
    }
    return newsBlocks;
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 fixed-top">
        <Container fluid>
          <Button variant="dark" className="me-2" onClick={toggleSidebar}>
            <FaBars />
          </Button>
          <Navbar.Brand href="#" onClick={handleAllNewsClick}>Notícias IFs</Navbar.Brand>

          <Nav className="mx-auto">
            <Nav.Link onClick={() => handleCategoryClick(5)}>Educação</Nav.Link>
            <Nav.Link onClick={() => handleCategoryClick(4)}>Economia</Nav.Link>
            <Nav.Link onClick={() => handleCategoryClick(12)}>Pop & Arte</Nav.Link>
          </Nav>

          <Nav className="d-flex align-items-center">
            {searchActive ? (
              <Form className="d-flex" onSubmit={handleSearch} ref={searchInputRef}>
                <FormControl
                  type="search"
                  name="search"
                  placeholder="Buscar"
                  className="me-2"
                  aria-label="Buscar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline-light" type="submit">Buscar</Button>
                <Button variant="outline-light" onClick={handleClearSearch}>
                  <AiOutlineClose />
                </Button>
              </Form>
            ) : (
              <Button variant="dark" onClick={toggleSearchBar}>
                <FaSearch />
              </Button>
            )}

            {userName && (
              <NavDropdown title={userName} id="basic-nav-dropdown" className="ms-3">
                <NavDropdown.Item onClick={handleProfile}>Meu Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Sair</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="start" style={{ width: '300px' }}>
        <Offcanvas.Body>
          <div className="text-center mb-3">
            <h5><strong>Categorias</strong></h5>
          </div>

          <div>
            {categories.map((category) => (
              <Nav.Link
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="py-2"
                style={{
                  paddingLeft: '10px',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #ccc',
                }}
              >
                {category.name}
              </Nav.Link>
            ))}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Container style={{ paddingTop: '80px' }} className="container-wrapper">
        {!isSearchTriggered ? (
          <>
            <Row className="mb-4">
              {/* Exibe as 3 primeiras notícias com imagem */}
              {filteredNews.filter(news => news.imageUrl).slice(0, 3).map((news) => (
                <Col md={4} key={news.id}>
                  <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card className="h-100">
                      <Card.Img
                        variant="top"
                        src={news.imageUrl}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <Card.Body>
                        <Card.Title style={{ fontWeight: 'bold' }}>{news.title}</Card.Title>
                        <Card.Text>{news.summary || 'Resumo da notícia'}</Card.Text>
                        <Card.Text className="text-muted">
                          {new Date(news.publicationDate).toLocaleDateString()}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
              ))}
            </Row>
            <Row>
              <Col md={8}>
                <Row>
                  {/* Exibe mais 4 notícias com imagem */}
                  {filteredNews.filter(news => news.imageUrl).slice(3, 7).map((news) => (
                    <Col md={6} className="mb-4" key={news.id}>
                      <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card className="h-100">
                          <Card.Img
                            variant="top"
                            src={news.imageUrl}
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                          <Card.Body>
                            <Card.Title style={{ fontWeight: 'bold' }}>{news.title}</Card.Title>
                            <Card.Text className="text-muted">
                              {new Date(news.publicationDate).toLocaleDateString()}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </a>
                    </Col>
                  ))}
                </Row>
              </Col>

              <Col md={4}>
                <Card className="mb-4" style={{ maxHeight: '800px', overflow: 'hidden', maxWidth: '100%' }}>
                  <Card.Header as="h5" style={{ fontWeight: 'bold' }}>Recomendados para você</Card.Header>
                  <Card.Body style={{ maxHeight: 'calc(800px - 56px)', overflowY: 'auto' }}>
                    <ul className="list-unstyled">
                      {filteredNews.slice(7, 14).map((news) => (
                        <li key={news.id} className="mb-2">
                          <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ color: 'red', fontWeight: 'bold' }}>
                            {news.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          // Exibição das notícias em blocos de 3 quando a busca é realizada
          renderNewsBlocks(filteredNews.filter(news => news.imageUrl))
        )}

        {!isSearchTriggered && (
          <>
            <hr />
            <h3 className="mb-4 font-weight-bold" style={{ fontWeight: '600' }}>Mais Notícias</h3>
            <Row>
              {filteredNews.filter(news => news.imageUrl).slice(14).map((news) => (
                <Col xs={12} sm={6} md={4} className="mb-4" key={news.id}>
                  <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card className="h-100">
                      <Card.Img variant="top" src={news.imageUrl} style={{ height: '150px', objectFit: 'cover' }} />
                      <Card.Body>
                        <Card.Title style={{ fontWeight: 'bold' }}>{news.title}</Card.Title>
                        <Card.Text className="text-muted">
                          {new Date(news.publicationDate).toLocaleDateString()}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>

      <footer className="bg-dark text-white text-center py-3 mt-4">
        <p>© 2024 Notícias IFs - Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
