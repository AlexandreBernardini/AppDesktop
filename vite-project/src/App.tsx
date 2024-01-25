import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const filterByGender = (userList: User[]) => {
    if (selectedGender === 'male' || selectedGender === 'female') {
      return userList.filter(user => user.gender === selectedGender);
    }
    return userList;
  };

  const sortByAge = (userList: User[]) => {
    if (selectedAge === 'asc') {
      return [...userList].sort((a, b) => a.dob.age - b.dob.age);
    }
    if (selectedAge === 'desc') {
      return [...userList].sort((a, b) => b.dob.age - a.dob.age);
    }
    return userList;
  };

  const searchUser = (userList: User[]) => {
    if (search) {
      return userList.filter(user => (
        user.name.first.toLowerCase().includes(search.toLowerCase()) ||
        user.name.last.toLowerCase().includes(search.toLowerCase())
      ));
    }
    return userList;
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://randomuser.me/api/?results=20');
      setUsers(response.data.results);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    finally{
      setIsLoading(false);
    }
  };

  const usersToDisplay = searchUser(sortByAge(filterByGender(users)));

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
     {isLoading && (
        <div className="spinner-container">
          <div className="loading-spinner">
          </div>
        </div>
      )}
      <div className={`content-container ${isLoading ? 'blur-background' : ''}`}>
        <h1>Hello !</h1>
        <hr />
        <button onClick={fetchUsers} className="btn btn-primary" disabled={isLoading}>Fetch users</button>
        <button onClick={() => setUsers([])} className="btn btn-danger" disabled={!users.length}>Clear users</button>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un utilisateur" />
        <hr />
        <label htmlFor="selectedGender">Filtrer par :</label>
        <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
          <option value="male">homme</option>
          <option value="female">femme</option>
          <option value="both">les deux</option>
        </select>
        <hr />
        <label htmlFor="selectedAge">Trier par :</label>
        <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
          <option value="asc">croissant</option>
          <option value="desc">décroissant</option>
          <option value="none">aucun</option>
        </select>
        <span id="user-length">{usersToDisplay.length}</span> utilisateurs
        {usersToDisplay.length > 0 ? (
          <table id="tbl-users" className="table table-hover">
            <thead>
              {usersToDisplay.map((user) => (
                <tr key={user.email}>
                  <td><img src={user.picture.thumbnail} alt="User Thumbnail" /></td>
                  <td>{user.gender === 'male' ? 'Monsieur' : 'Madame'} {user.name.first} {user.name.last}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.dob.age}</td>
                </tr>
              ))}
            </thead>
          </table>
        ) : (
          <div className="alert alert-info">
            <h1>pas d'utilisateurs</h1>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
