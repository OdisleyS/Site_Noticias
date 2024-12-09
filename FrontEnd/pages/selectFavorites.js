import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

export default function SelectFavorites() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userName, setUserName] = useState('');
  const router = useRouter();

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
    fetchCategories();
  }, [router]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(categoryId)
        ? prevSelectedCategories.filter((id) => id !== categoryId)
        : [...prevSelectedCategories, categoryId]
    );
  };

  const handleSaveFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedCategories),
      });

      if (!response.ok) {
        throw new Error('Failed to save favorite categories');
      }

      alert('Categorias favoritas atualizadas com sucesso!');
      router.push('/news'); // Redireciona para a página de notícias
    } catch (error) {
      console.error('Error saving favorite categories:', error);
      alert('Erro ao salvar categorias favoritas. Tente novamente.');
    }
  };

  return (
    <>
      <Container className="mt-4">
        <h2>Bem-vindo, {userName}!</h2>
        <h4>Selecione suas Categorias Favoritas</h4>
        <ListGroup>
          {categories.map((category) => (
            <ListGroup.Item
              key={category.id}
              active={selectedCategories.includes(category.id)}
              onClick={() => handleCategoryToggle(category.id)}
              style={{ cursor: 'pointer' }}
            >
              {category.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Button variant="primary" className="mt-3" onClick={handleSaveFavorites}>
          Salvar Categorias Favoritas
        </Button>
      </Container>
    </>
  );
}
