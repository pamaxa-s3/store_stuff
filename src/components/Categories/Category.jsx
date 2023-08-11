import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useGetProductsQuery } from '../../features/api/apiSlice';

import Products from '../Products/Products'

import styles from '../../styles/Category.module.css';
import { useSelector } from 'react-redux';

const Category = () => {

	const { id } = useParams();
	const { list } = useSelector(({ categories }) => categories);


	const defaultValues = {
		title: '',
		price_min: 0,
		price_max: 0,
	};

	const defaultParams = {
		...defaultValues,
		categoryId: id,
		limit: 5,
		offset: 0
	};

	const [isEnd, setEnd] = useState(false);
	const [catTitle, setCatTitle] = useState(null);
	const [items, setItems] = useState([]);
	const [values, setValues] = useState(defaultValues);
	const [params, setParams] = useState(defaultParams);
	const [isFetching, setFetching] = useState(true);

	const { data = [], isLoading, isSuccess } = useGetProductsQuery(params);

	useEffect(() => {
		if (!id) return;

		setValues(defaultValues);
		setItems([]);
		setEnd(false);

		setFetching(false);

		setParams({ ...defaultParams, categoryId: id });
		// eslint-disable-next-line 
	}, [id]);

	useEffect(() => {
		if (isLoading) return;

		if (!data.length) return setEnd(true);

		setItems((_items) => [..._items, ...data]);

	}, [data, isLoading]);

	useEffect(() => {
		if (!id || !list.length) return;

		const category = list.find(item => item.id === id * 1);

		setCatTitle(category);

	}, [list, id]);

	const footerBlock = document.querySelector('#footer');
	const footerBlockHeight = footerBlock && footerBlock.offsetHeight;

	const handleChange = ({ target: { value, name } }) => {
		setValues({ ...values, [name]: value });
	}

	const handleSubmit = (e) => {
		e.preventDefault();

		setItems([]);
		setEnd(false);
		setParams({ ...defaultParams, ...values });

		setFetching(false);
	};

	const scrollHandler = useCallback((e) => {
		if (e.target.documentElement.scrollHeight -
			(e.target.documentElement.scrollTop + window.innerHeight + footerBlockHeight) < 150) {
			setFetching(true);
		}
	}, [footerBlockHeight]);

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler);

		return function () {
			document.removeEventListener('scroll', scrollHandler);
		};
	}, [scrollHandler]);


	useEffect(() => {
		isFetching && !isEnd &&
			(items.length % defaultParams.limit === 0) &&
			setParams({ ...params, offset: params.offset + params.limit });
		setFetching(false);

	}, [isFetching, defaultParams.limit, isEnd, items.length, params]);

	const handleReset = () => {
		setValues(defaultValues);
		setParams(defaultParams);
		setEnd(false);
		setFetching(false);
	}

	return (
		<section className={styles.wrapper}>
			<h2 className={styles.title}>{catTitle?.name}</h2>
			<form className={styles.filters} onSubmit={handleSubmit}>
				<div className={styles.filter}>
					<input
						type="text"
						name="title"
						placeholder='Product name'
						onChange={handleChange}
						value={values.title} />
				</div>
				<div className={styles.filter}>
					<input
						type="number"
						name="price_min"
						placeholder='0'
						onChange={handleChange}
						value={values.price_min} />
					<span>Price from</span>
				</div>
				<div className={styles.filter}>
					<input
						type="number"
						name="price_max"
						placeholder='0'
						onChange={handleChange}
						value={values.price_max} />
					<span>Price to</span>
				</div>
				<button type="submit" hidden />
			</form>

			{isLoading ? (
				<div className='preloader'>Loading...</div>
			) :
				!isSuccess || !items.length ? (
					<div className={styles.back}>
						<span>No results</span>
						<button
							onClick={handleReset}>
							Reset
						</button>
					</div>
				) : (
					<Products
						title=""
						products={items}
						style={{ padding: 0 }}
						amount={items.length}
						btnSeaMore={false}
					/>)}

			{/* <div className={styles.more}>
				{!isEnd && (items.length % defaultParams.limit === 0) && (
					<button onClick={() => setParams({ ...params, offset: params.offset + params.limit })}>
						See more
					</button>

				)}
			</div> */}

		</section>
	)
}

export default Category;
