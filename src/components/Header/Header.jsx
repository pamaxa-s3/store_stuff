import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

import LOGO from '../../images/logo.svg'
import AVATAR from '../../images/avatar.jpg'

import styles from '../../styles/Header.module.css';
import { toggleForm } from '../../features/user/userSlice';
import { useGetProductsQuery } from '../../features/api/apiSlice';

const Header = () => {

	const [user, setUser] = useState({
		name: 'Guest',
		avatar: AVATAR
	});


	const [searchValue, setSearchValue] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { currentUser, cart, favourite } = useSelector(({ user }) => user);
	const quantityItemsOfCart = cart.reduce((acc, prev) => acc + prev.quantity, 0);

	const [countFavaurites, setCountFavaurites] = useState(null);

	useEffect(() => {
		setCountFavaurites(favourite.length);
	}, [favourite]);

	const { data, isLoading } = useGetProductsQuery({ title: searchValue });

	useEffect(() => {
		if (!currentUser) return;

		setUser(currentUser);
	}, [currentUser]);

	const handleClick = () => {
		if (!currentUser) dispatch(toggleForm(true));
		else navigate(ROUTES.PROFILE);
	};

	const handleSearch = ({ target: { value } }) => {
		setSearchValue(value);
	};

	return (
		<div className={styles.header}>
			<div className={styles.logo}>
				<Link to={ROUTES.HOME}>
					<img src={LOGO} alt="Stuff" />
				</Link>
			</div>

			<div className={styles.info}>
				<div className={styles.user} onClick={handleClick}>
					<div className={styles.avatar} style={{ backgroundImage: `url(${user.avatar})` }} />
					<div className={styles.userName}>{user.name}</div>
				</div>
				<form className={styles.form}>
					<div className={styles.icon}>
						<svg className="icon">
							<use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#search`} />
						</svg>
					</div>
					<div className={styles.input}>
						<input
							type="search"
							name='search'
							placeholder='Search for anything...'
							autoComplete='off'
							onChange={handleSearch}
							value={searchValue}
						/>
					</div>
					{searchValue && <div className={styles.box}>
						{isLoading ? 'Loading' : !data.length ? 'No results' : (
							data.map(({ title, images, id }) => {
								return (
									<Link className={styles.item} to={`/products/${id}`} onClick={() => setSearchValue('')}>
										<div className={styles.image} style={{ backgroundImage: `url(${images[0]})` }} />
										<div className={styles.title}>{title}</div>
									</Link>
								)
							})
						)}
					</div>}
				</form>
				<div className={styles.account}>
					<Link to={ROUTES.FAVOURITES} className={styles.favourites}>
						<svg className={styles["icon-fav"]}>
							<use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#heart`} />
						</svg>
						{!!countFavaurites &&
							<span className={styles.count}>{countFavaurites}</span>
						}
					</Link>

					<Link to={ROUTES.CART} className={styles.cart}>
						<svg className={styles["icon-cart"]}>
							<use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#bag`} />
						</svg>
						{!!quantityItemsOfCart &&
							<span className={styles.count}>{quantityItemsOfCart}</span>
						}
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Header
