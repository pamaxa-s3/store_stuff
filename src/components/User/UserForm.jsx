import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import UserSignUpForm from './UserSignUpForm';

import styles from '../../styles/User.module.css';
import { toggleForm, changeFormType } from '../../features/user/userSlice';
import UserLoginForm from './UserLoginForm';
import { FORM_TYPES } from '../../utils/constans';

const UserForm = () => {

	const dispatch = useDispatch();

	const { showForm, formType } = useSelector(({ user }) => user);

	const closeForm = () => dispatch(toggleForm(false));
	const handleChangeFormType = (type) => dispatch(changeFormType(type));

	return (
		showForm ? (
			<>
				<div className={styles.overlay}
					onClick={closeForm}
				/>
				{formType === FORM_TYPES.SIGN_UP ?
					<UserSignUpForm closeForm={closeForm} handleChangeFormType={handleChangeFormType} /> :
					<UserLoginForm closeForm={closeForm} handleChangeFormType={handleChangeFormType} />}
			</>
		) : <></>

	)
}

export default UserForm
