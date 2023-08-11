import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from '../../styles/Cart.module.css';
import { sumBuy } from '../../utils/common';
import { addItemToCart, removeItemFromCart, addItemToFavourites } from '../../features/user/userSlice';

const Cart = () => {
	const { cart, favourite } = useSelector(({ user }) => user);

	const dispatch = useDispatch();

	const changeQuantity = (item, quantity) => dispatch(addItemToCart({ ...item, quantity }));

	const removeItem = id => dispatch(removeItemFromCart(id));

	const toggleFavourites = (item) => {
		dispatch(addItemToFavourites(item));
	};

	return (
		<section className={styles.cart}>
			<h2 className={styles.title}>Your cart</h2>

			{!cart.length ? (
				<div className={styles.empty}>Here is empty</div>
			) : (
				<>
					<div className={styles.list}>
						{cart.map((item) => {
							const { title, category, images, price, id, quantity } = item;

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

									<div className={styles.price}>{price}$</div>

									<div className={styles.quantity}>
										<div
											className={styles.minus}
											onClick={() => changeQuantity(item, Math.max(1, quantity - 1))}
										>
											<svg className="icon">
												<use
													xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#minus`}
												/>
											</svg>
										</div>

										<span>{quantity}</span>

										<div
											className={styles.plus}
											onClick={() => changeQuantity(item, quantity + 1)}
										>
											<svg className="icon">
												<use
													xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#plus`}
												/>
											</svg>
										</div>
									</div>

									<div className={styles.total}>{price * quantity}$</div>

									<div
										className={favourite.some(obj => obj.id === item.id) ? styles['favourite'] : styles['close']}
										onClick={() => toggleFavourites(item)}
									>
										<svg className='icon' >
											<use
												xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#heart`}
											/>
										</svg>
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

					<div className={styles.actions}>
						<div className={styles.total}>
							TOTAL PRICE:{" "}
							<span>
								{sumBuy(cart.map(({ quantity, price }) => quantity * price))}$
							</span>
						</div>

						<button className={styles.proceed}>Proceed to checkout</button>
					</div>
				</>
			)}
		</section>
	);
};

export default Cart;