import React from 'react';
import styles from '../ArticleDitails/ArticaleDitales.module.scss';
import { Button, message, Popconfirm } from 'antd';
import { ArticlesApi } from '../../api/articlesApi';
import { useHistory } from 'react-router-dom';

const api = new ArticlesApi();

export const Buttons = ({ slug, userData, deleteArticle, onEditArticle }) => {
  const history = useHistory();
  const confirm = () => {
    message.success('Click on Yes');
    api.deleteAnArticle(slug, userData);
    deleteArticle(slug);
    history.push('/articles/');
  };
  const cancel = () => {
    message.error('Click on No');
  };
  return (
    <div className={styles.edit_article_btns}>
      <Popconfirm
        title="Delete the article"
        description="Are you sure to delete this article?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No">
        <Button danger>Delete</Button>
      </Popconfirm>
      <Button onClick={() => onEditArticle(slug)}>Edit</Button>
    </div>
  );
};
