import { useState } from 'react';
import styles from '../HeaderWhite/HeaderW.module.scss';
import { NavLink } from 'react-router-dom';
import { Photos } from '../../../../photo';

export default function HeaderW() {
    const [isOpen, setIsOpen] = useState(false);
    const cities = ['Москва', 'Казань', 'Нижний Новгород'];
    const [city, setCity] = useState('Нижний Новгород');

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <NavLink to="/">
                    <img src={Photos.LogoBl} alt="Future Academy" />
                </NavLink>

                <nav>
                    <ul>
                        <li>
                            <img src={Photos.AllCourse} alt="" />
                            <NavLink to="/course">Все курсы</NavLink>
                        </li>
                        <li>
                            <NavLink to="/events">Мероприятия</NavLink>
                        </li>
                        <li>
                            <NavLink to="/knowledge">Базы знаний</NavLink>
                        </li>
                        <li>
                            <NavLink to="/career">Карьера</NavLink>
                        </li>
                    </ul>
                </nav>

                <div className={styles.headerActions}>
                    <div className={styles.location} onClick={() => setIsOpen(!isOpen)}>
                        <img className={styles.locationImg} src={Photos.Map} alt="" />
                        <p>{city}</p>
                        {isOpen && (
                            <ul className={styles.cityList}>
                                {cities.map((item) => (
                                    <li
                                        key={item}
                                        onClick={() => {
                                            setCity(item);
                                            setIsOpen(false);
                                        }}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <img
                            className={`${styles.arrowDownImg} ${isOpen ? styles.arrowUp : ''}`}
                            src={Photos.Arrow}
                            alt=""
                        />
                    </div>
                    <a href="">8 800 950-33-98</a>
                    <NavLink className={styles.loginBlock} to="/login">
                        <img src={Photos.User} alt="" />
                        <span>Войти</span>
                    </NavLink>
                </div>
            </div>
        </header>
    );
}
