import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Alert from './components/Alert';
import List from './components/List';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')))
  } else {
    return [];
  }
}

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({show: false,
  msg:"", type:""});

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!name) {
      showAlert(true, 'danger', 'Please enter value');
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if(item.id === editId) {
            return {...item, title: name}
          }
          return item
        })
      );
      setName('');;
      setEditId(null)
      setIsEditing(false)
      showAlert(true, 'success', 'Value Changes');
    } else {
      showAlert(true, 'success', 'Item Added to the List')
      const newItem = {id: new Date().getTime().toString(), title: name}
      setList([...list, newItem]);
      setName('');
    }
  }
  const showAlert = (show = false, type = "", msg= "") => {
    setAlert({ show, type, msg})
  }
  const removeItem = (id) => {
    showAlert(true, 'danger', 'Item Removed')
    setList(list.filter((item) => item.id !== id))
  }
  const editItem = (id) => {
    const editItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(editItem.title);
  }
  const clearList = () => {
    showAlert(true, 'danger', 'Empty List');
    setList([]);
  }

  useEffect(()=> {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list])

  return (
    <section className='section-center'>
    <form onSubmit={handleSubmit}>
      {alert.show && <Alert {...alert} removeAlert={showAlert}
      list={list} />}
      <h3 style={{  marginBottom: "1.5rem", textAlign: "center" }}
      > Todo ni boss</h3>
      <div className='mb-3 form'>
        <input 
          type='text'
          className='form-control'
          placeholder='e.g. Bread'
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <button type='submit'
        className='btn btn-success'>
          {isEditing ? 'Edit' : 'Submit'}
        </button>
      </div>
      </form>
        {list.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <List items={list} removeItem={removeItem}
            editItem={editItem} />
            <div className='text-center'>
              <button className='btn btn-warning'
                onClick={clearList}>
                Clear Items
              </button>
            </div>
          </div>
        )}

    </section>
  );
}

export default App;
