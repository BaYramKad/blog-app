import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useHistory } from 'react-router-dom';
import { ArticlesApi } from '../../api/articlesApi';

import FormComponent from '../FormComponent';
import { useRouteMatch } from 'react-router-dom';

const apiUser = new ArticlesApi();

const CreateArticle = ({ setNewArticle, editedArticle }) => {
  const count = useRef(0);
  const history = useHistory();
  const routeMath = useRouteMatch('/articles/:id');

  const form = useForm({
    mode: 'onChange',
  });

  const onSave = (data, inputValue) => {
    const requestData = {
      ...data,
      tagList: Object.values(inputValue),
    };
    if (!editedArticle) {
      apiUser
        .createAnArticle(requestData)
        .then((res) => {
          setNewArticle(res);
          history.push('/articles/');
        })
        .catch((err) => {
          form.setError('title', {
            type: 'title',
            message: err.message,
          });
        });
    } else {
      apiUser
        .updateAnArticle(requestData, routeMath?.params?.id)
        .then((res) => {
          setNewArticle(res);
          history.push('/articles/');
        })
        .catch((err) => {
          form.setError('title', {
            type: 'title',
            message: err.message,
          });
        });
    }
  };

  return <FormComponent count={count} form={form} onSave={onSave} editedArticle={editedArticle} />;
};

export default CreateArticle;
