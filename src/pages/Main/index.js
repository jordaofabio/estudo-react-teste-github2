import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepository: '',
    repositories: [{ name: 'jordaofabio/teste-github2' }],
    loading: false,
    invalid: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const repositories = this.state.repositories;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = (e) => {
    this.setState({ newRepository: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.state.newRepository) {
      this.setState({ invalid: true });
      return;
    }

    this.setState({ loading: true });

    try {
      const { newRepository, repositories } = this.state;

      const response = await api.get(`/repos/${newRepository}`);
      const data = {
        name: response.data.full_name,
      };

      this.setState({
        invalid: false,
        repositories: [...repositories, data],
        newRepository: '',
        loading: false,
      });
    } catch (err) {
      this.setState({
        invalid: true,
        loading: false,
      });
    }
  };

  render() {
    const { newRepository, loading, repositories, invalid } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} invalid={invalid}>
          <input
            type="text"
            placeholder={
              !invalid
                ? 'Adicionar repositório'
                : 'ex.: jordaofabio/teste-github2'
            }
            value={newRepository}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map((repository) => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
