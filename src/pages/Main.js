import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: match.params.id,
        }
      })
      setUsers(response.data);
    }

    loadUsers();
  }, [match.params.id]);

  useEffect(() =>{
    const socket = io('http://localhost:3333', {
      query: { user: match.params.id}
    });
    socket.on('match', dev =>{
      setMatchDev(dev);
    })


    // teste de conexão entre backend e frontend
    // socket.on('world', message => {
    //     console.log(message)
    // })

    // setTimeout(() =>{
    //   socket.emit('hello', {
    //     message: 'Hello World'
    //   });
    // }, 3000)
  }, [match.params.id])

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      //3º parametro
      headers: { user: match.params.id },
    })
    //Sempre usar o setUsers (subscreve), filtrar todos os Id, sendo id diferente
    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      //3º parametro
      headers: { user: match.params.id },
    })
    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main-container">
      <Link to="/" >
      <img src={logo} alt="Tindev" />
      </Link>
      { users.length > 0 ? (
        <ul>
          {users.map(user => (
             //Necessario o 1º elemento com o Key
             <li key={user._id}>

              <img src={user.avatar} alt={user.name} />
              <footer >
                <h2>{user.name}</h2>
                <p>{user.bio}</p>

              </footer>
              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={dislike} alt="Dislike" />
                </button>
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">Acabou :(</div>
      )}
      { matchDev && (
        <div className="match-container">
          <h1>Is Match</h1>
          <img src={matchDev.avatar} alt="" className="avatar"/>
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>
          <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
        </div>
      )}
    </div>
  )
}
