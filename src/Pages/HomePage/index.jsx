import React from 'react';
import Card from '../../components/Card';
import DataContext from '../../context';
import CardLoader from '../../components/CardLoader';

import styles from './HomePage.module.scss';

function HomePage() {
  const [searchValue, setSearchValue] = React.useState('');

  const dataContext = React.useContext(DataContext);

  const handleChangeSearch = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <>
      <div
        className={`${styles['search-bar']} d-flex align-center justify-between mb-40`}
      >
        <h1>{searchValue ? `Поиск по: "${searchValue}"` : 'Все кроссовки'}</h1>
        <div className={`${styles['search-block']} d-flex align-center`}>
          <img height={16} width={16} src="img/search.svg" alt="Search" />
          <input
            onChange={handleChangeSearch}
            value={searchValue}
            placeholder="Поиск..."
          />
          {searchValue && (
            <img
              onClick={() => setSearchValue('')}
              className="close-btn"
              src="/img/btn-remove.svg"
              alt="Close"
            />
          )}
        </div>
      </div>

      <div className={`${styles['product-cards']}`}>
        {dataContext.cardsIsDownloading
          ? [...Array(8)].map((_, i) => <CardLoader key={i} />)
          : dataContext.items
              .filter((item) =>
                item.title.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((obj, i) => {
                return (
                  <Card
                    key={i}
                    item={obj}
                    title={obj.title}
                    price={obj.price}
                    image={obj.image}
                  />
                );
              })}
      </div>
    </>
  );
}

export default HomePage;
