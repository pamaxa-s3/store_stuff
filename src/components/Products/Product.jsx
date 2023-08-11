import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../utils/routes';

import styles from '../../styles/Product.module.css';
import { addItemToCart, addItemToFavourites } from '../../features/user/userSlice';

const SIZES = [4, 4.5, 5];

const Product = (item) => {

	const { images, title, price, description } = item;

	const dispatch = useDispatch();

	const user = useSelector(({ user }) => user);
	const [currentImage, setCurrentImage] = useState();
	const [currentSize, setCurrentSize] = useState();
	const [isFavourite, setFavourite] = useState(false);


	useEffect(() => {
		if (!images.length) return;

		setCurrentImage(images[0]);
	}, [images]);

	const addToCart = () => {
		dispatch(addItemToCart(item));
	};

	const addToFavourites = () => {
		dispatch(addItemToFavourites(item));
	};

	useEffect(() => {
		// if (!user.currentUser) return;
		setFavourite(user.favourite.some(obj => obj.id === item.id));
	}, [user, item]);

	return (
		<section className={styles.product}>
			<div className={styles.images}>
				<div
					className={styles.current}
					style={{ background: `url(${currentImage})` }}
				/>
				<div className={styles['images-list']}>
					{images.map((image, i) => (
						<div
							key={i}
							className={styles.image}
							style={{ background: `url(${image})` }}
							onClick={() => setCurrentImage(image)}
						/>
					))}
				</div>
			</div>

			<div className={styles.info}>
				<h1 className={styles.title}>{title}</h1>
				<div className={styles.price}>{price} $</div>
				<div className={styles.color}>
					<span>Color:</span> Green
				</div>
				<div className={styles.sizes}>
					<span>Sizes:</span>
					<div className={styles.list}>
						{
							SIZES.map(size => (
								<div
									key={size}
									className={`${styles.size} ${currentSize === size && styles.active}`}
									onClick={() => setCurrentSize(size)}
								>
									{size}
								</div>
							))
						}
					</div>
				</div>

				<p className={styles.description}>{description}</p>
				<div className={styles.actions}>
					<button
						className={styles.add}
						disabled={!currentSize}
						onClick={addToCart}
					>
						Add to cart
					</button>
					<button
						className={isFavourite ? styles.favourite_true : styles.favourite}
						onClick={addToFavourites}
					>
						Add to favourites</button>
				</div>
				<div className={styles.bottom}>
					<div className={styles.purchase}>19 people purchased</div>
					<Link to={ROUTES.HOME}>Return to store</Link>
				</div>
			</div>
		</section>
	)
}

export default Product
