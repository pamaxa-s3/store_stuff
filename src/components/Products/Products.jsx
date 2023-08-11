import React from 'react'

import styles from '../../styles/Products.module.css';
import { Link } from 'react-router-dom';

const Products = ({ title, style, products = [], amount, btnSeaMore }) => {

	const list = products.slice(0, amount);

	return (
		<section className={styles.products} style={style} >
			{title && <h2>{title}</h2>}
			<div className={styles.list} id='productsBox'>
				{list.map(({ id, title, images, category: { name: cat }, price }) => {

					return (
						<Link key={id} to={`/products/${id}`} className={styles.product}>
							<div className={styles.image} style={{ backgroundImage: `url(${title === 'Pavilion' ? images[1] : images[0]})` }} />
							<div className={styles.wrapper}>
								<h3 className={styles.title}>{title}</h3>
								<div className={styles.cat}>{cat}</div>
								<div className={styles.info}>
									<div className={styles.prices}>
										<div className={styles.price}>{price}$</div>
										<div className={styles.oldPrice}>{Math.floor(price * 1.2)}$</div>
									</div>
									<div className={styles.purchases}>
										{Math.floor(Math.random() * 20 + 1)} purchased
									</div>
								</div>
							</div>
						</Link>
					)
				})}
				{btnSeaMore && <button className={styles.button} style={{ margin: '0 auto' }}>See more</button>}
			</div>
		</section>
	)
}

export default Products
