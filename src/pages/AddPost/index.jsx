import React, { useState, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import axios from '../../axios'

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useEffect } from 'react';

export const AddPost = () => {
  const navigate = useNavigate()
  const {id} = useParams()

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const inputFile = useRef(null)

  const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (e) {
      console.log(e);
      alert('Не удалось загрузить файл')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true)

      const fields = {
        title,
        tags,
        text,
        imageUrl
      }

      const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields)

      const _id = isEditing ? id : data._id
      navigate(`/posts/${_id}`)

    } catch (e) {
      console.log(e);
      alert('Не удалось создать пост')
    }
  } 

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({data}) => {
        setTitle(data.title)
        setTags(data.tags.join(','))
        setText(data.text)
        setImageUrl(data.imageUrl)
      }).catch((e) => {
        console.log(e);
      })
    }    
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFile.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFile} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )}
      {imageUrl && (
        <img className={styles.image} src={`http://localhost:5000${imageUrl}`} alt="Uploaded" />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
