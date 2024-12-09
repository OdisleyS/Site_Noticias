import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Form, Button, Image, ListGroup } from 'react-bootstrap';

export default function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    login: '',
    phone: '',
    birthDate: '',
    profilePicture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F306%2F306232.png&f=1&nofb=1&ipt=a64283a980f96c430dbfa9a64f03f857c6da2a752027a20a72a79d4ac8670e79&ipo=images', // Imagem fixa de perfil
    preferredCategories: [], // Categorias preferidas salvas
  });
  const [categories, setCategories] = useState([]); // Todas as categorias disponíveis
  const [selectedCategories, setSelectedCategories] = useState([]); // Categorias selecionadas pelo usuário
  const [isEditingCategories, setIsEditingCategories] = useState(false); // Controle de edição de categorias
  const router = useRouter();

  // Carregar os dados do usuário e as categorias ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    // Busca os dados do perfil do usuário, mesmo que as categorias já estejam no localStorage
    const fetchUserData = async () => {
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
        setUserData({
          ...data,
          preferredCategories: data.preferredCategories || [], // Inicializa as categorias preferidas
        });

        // Verifica se as categorias já estão no localStorage, senão usa as do backend
        const storedCategories = localStorage.getItem('preferredCategories');
        if (storedCategories) {
          setSelectedCategories(JSON.parse(storedCategories));
        } else {
          setSelectedCategories(data.preferredCategories || []); // Carrega as categorias do backend se não estiverem no localStorage
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
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
        setCategories(data); // Carrega todas as categorias disponíveis
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchUserData();
    fetchCategories();
  }, [router]);

  // Manipula a seleção/deseleção de categorias
  const handleCategoryToggle = (categoryId) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId) // Remove categoria
      : [...selectedCategories, categoryId]; // Adiciona categoria

    setSelectedCategories(updatedCategories);
    localStorage.setItem('preferredCategories', JSON.stringify(updatedCategories)); // Salva no localStorage
  };

  // Salva as categorias selecionadas e mantém no backend
  const handleSaveFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedCategories), // Envia as categorias selecionadas
      });

      if (!response.ok) {
        throw new Error('Failed to save favorite categories');
      }

      // Atualiza as categorias preferidas do usuário
      setUserData((prevUserData) => ({
        ...prevUserData,
        preferredCategories: selectedCategories, // Atualiza com as selecionadas
      }));

      alert('Categorias favoritas atualizadas com sucesso!');
      setIsEditingCategories(false); // Fecha o modo de edição
    } catch (error) {
      console.error('Error saving favorite categories:', error);
      alert('Erro ao salvar categorias favoritas. Tente novamente.');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <Image
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F306%2F306232.png&f=1&nofb=1&ipt=a64283a980f96c430dbfa9a64f03f857c6da2a752027a20a72a79d4ac8670e79&ipo=images"
                roundedCircle
                className="mb-4"
                style={{ width: '150px', height: '150px' }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <h4>Informações do Perfil</h4>
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" value={userData.name} readOnly />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={userData.email} readOnly />
                </Form.Group>
                <Form.Group controlId="formLogin">
                  <Form.Label>Login</Form.Label>
                  <Form.Control type="text" value={userData.login} readOnly />
                </Form.Group>
                <Form.Group controlId="formPhone">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" value={userData.phone} readOnly />
                </Form.Group>
                <Form.Group controlId="formBirthDate">
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Form.Control type="date" value={userData.birthDate} readOnly />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Body>
              <h4>Categorias Preferidas</h4>
              <ListGroup>
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((categoryId) => {
                    const category = categories.find((cat) => cat.id === categoryId);
                    return category ? (
                      <ListGroup.Item key={category.id}>
                        {category.name}
                      </ListGroup.Item>
                    ) : null;
                  })
                ) : (
                  <ListGroup.Item>Sem categorias preferidas selecionadas</ListGroup.Item>
                )}
              </ListGroup>
              <Button variant="danger" className="mt-3" onClick={() => setIsEditingCategories(true)}>
                Editar Categorias
              </Button>
            </Card.Body>
          </Card>

          {isEditingCategories && (
            <Card className="mt-4">
              <Card.Body>
                <h4>Selecione suas Categorias Favoritas</h4>
                <ListGroup>
                  {categories.map((category) => (
                    <ListGroup.Item
                      key={category.id}
                      active={selectedCategories.includes(category.id)} // Mostra categorias selecionadas
                      onClick={() => handleCategoryToggle(category.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {category.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Button variant="danger" className="mt-3" onClick={handleSaveFavorites}>
                  Salvar Categorias Favoritas
                </Button>
                <Button variant="secondary" className="mt-3 ml-2" onClick={() => setIsEditingCategories(false)}>
                  Cancelar
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}
