import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from '../../styles/Cart.module.css';
import { removeItemFromFavourites } from '../../features/user/userSlice';

const Favourites = () => {
	const { favourite } = useSelector(({ user }) => user);

	const dispatch = useDispatch();

	const removeItem = id => dispatch(removeItemFromFavourites(id));


	return (
		<section className={styles.cart}>
			<h2 className={styles.title}>Your favourite items</h2>

			{!favourite.length ? (
				<div className={styles.empty}>Here is empty</div>
			) : (
				<>
					<div className={styles.list}>
						{favourite.map((item) => {
							const { title, category, images, id } = item;


							return (
								<div
									className={styles.item}
									key={id}
								>
									<Link
										to={`/products/${id}`}
										className={styles.image}
										style={{ backgroundImage: `url(${images[0]})` }}
									/>
									<div className={styles.info}>
										<Link to={`/products/${id}`} className={styles.name}>{title}</Link>
										<Link to={`/categories/${category.id}`} className={styles.category}>{category.name}</Link>
									</div>


									<div
										className={styles.close}
										onClick={() => removeItem(item.id)}
									>
										<svg className="icon">
											<use
												xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#close`}
											/>
										</svg>
									</div>
								</div>
							);
						})}
					</div>
				</>
			)}
		</section>
	);
};

export default Favourites;
