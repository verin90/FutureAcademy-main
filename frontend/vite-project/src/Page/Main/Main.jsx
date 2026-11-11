import { useState } from 'react';
import styles from './Main.module.scss';
import { Photos } from '../../../../photo';

export default function Main() {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const tabsData = [
        {
            id: 'children',
            title: 'Дети',
            subtitle: '8 — 14 лет',
            icon: Photos.Children,
            courses: [
                'Робототехника',
                'Создание игр',
                'Программирование',
                'Мультимедиа',
                'Soft skills',
                'Шахматы',
                'Блогинг',
                'Создание игр',
                'Программирование',
                'Мультимедиа',
                'Soft skills',
            ],
        },
        {
            id: 'teen',
            title: 'Подростки',
            subtitle: '14 — 18 лет',
            icon: Photos.Teen,
            courses: [
                'Web-разработка',
                'Прикладное программирование',
                'Графическое моделирование',
                'Game Development',
                'Soft skills',
                'Разработчик мобильных приложений',
                'Блогинг',
                'Создание игр',
                'Программирование',
                'Мультимедиа',
                'Soft skills',
            ],
        },
        {
            id: 'adult',
            title: 'Взрослые',
            subtitle: '18 — ∞',
            icon: Photos.Adult,
            courses: [
                'Разработчик игр на Unity',
                'Разработка ПО',
                'Графический Дизайн',
                'Тестировщик ПО',
                'Интернет Маркетинг',
                'Java-разработчик',
                'Python-разработчик',
                'iOS-разработчик',
                'Программирование',
            ],
        },
    ];

    return (
        <>
            <section className={styles.mainBanner}>
                <div className={styles.container}>
                    <h1>Образовательная платформа ХОД Future Academy</h1>
                    <p>Актуальные знания для новичков и профессионалов</p>
                </div>
            </section>

            <section className={styles.courseCategories}>
                <div className={styles.container}>
                    <div className={styles.taglineBlock}>
                        <img src={Photos.SovaTag} alt="" />
                        <div className={styles.taglineText}>
                            <h4>Кем вы хотите стать?</h4>
                            <p>
                                Пора найти себя <br /> и выбрать подходящий <br /> курс :)
                            </p>
                            <p>Удачи!</p>
                        </div>
                    </div>

                    <div className={styles.programList}>
                        {/* ВЕРХНЯЯ ЧАСТЬ: ВКЛАДКИ */}
                        <div className={styles.top}>
                            {tabsData.map((tab, index) => (
                                <div
                                    key={tab.id}
                                    className={`${styles.ageCards} ${activeTabIndex === index ? styles.active : ''}`}
                                    onClick={() => setActiveTabIndex(index)}>
                                    <img src={tab.icon} alt="" />
                                    <div className={styles.text}>
                                        <h3>{tab.title}</h3>
                                        <p>{tab.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.bottom}>
                            <ul className={styles.courseList}>
                                {tabsData[activeTabIndex].courses.map((course, i) => (
                                    <li key={i}>{course}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.videoBanner}>
                <div className={styles.container}>
                    <div className={styles.videoImg}>
                        <img src={Photos.Video} alt="" />
                    </div>
                </div>
            </section>

            <section className={styles.statsSection}>
                <div className={styles.container}>
                    {/* Заголовок */}
                    <div className={styles.topText}>
                        <h2>
                            Актуальные знания от признанных экспертов рынка
                            <br />
                            для новичков и практикующих специалистов.
                        </h2>
                    </div>

                    {/* Статистика (600, 82, 14795) */}
                    <div className={styles.statsRow}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>600</span>
                            <span className={styles.statLabel}>Курсов</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>82</span>
                            <span className={styles.statLabel}>Ведущих преподавателей</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>14 795</span>
                            <span className={styles.statLabel}>Выпускников</span>
                        </div>
                    </div>

                    {/* Желтый баннер "День открытых дверей" */}
                    <div className={styles.openDayBanner}>
                        <div className={styles.openDayDate}>
                            <span className={styles.bigNum}>25</span>
                            <span className={styles.month}>ноября</span>
                        </div>
                        <div className={styles.openDayText}>
                            <h4>День открытых дверей</h4>
                            <p>
                                Приглашаем всех желающих на бесплатную экскурсию в мир
                                востребованных профессий и полезных навыков
                            </p>
                        </div>
                        <button className={styles.signUpBtn}>Записаться &gt;</button>
                    </div>

                    {/* Сетка: Большой квадрат слева + Колонка справа */}
                    <div className={styles.gridWrapper}>
                        {/* 1. Большой квадрат слева (Программы обучения) */}
                        <div className={styles.bigCard}>
                            <div className={styles.cardContent}>
                                <img
                                    src={Photos.ProgramsIcon || 'https://via.placeholder.com/50'}
                                    alt=""
                                />
                                <div className={styles.textBlock}>
                                    <h3>Программы обучения</h3>
                                    <p>
                                        В списке наших курсов вы сможете найти профессию и занятие
                                        по душе, изучить новое и получить практические знания,
                                        которые помогут получить работу мечты.
                                    </p>
                                </div>
                            </div>
                            <button className={styles.moreBtn}>Подробнее &gt;</button>
                        </div>

                        {/* 2. Правая колонка */}
                        <div className={styles.rightColumn}>
                            {/* Верхний ряд: Новости + Мир IT */}
                            <div className={styles.topRow}>
                                <div className={`${styles.smallCard} ${styles.lightBlueCard}`}>
                                    <img
                                        src={Photos.NewsIcon || 'https://via.placeholder.com/50'}
                                        alt=""
                                    />
                                    <h3>Новости Академии</h3>
                                </div>
                                <div className={`${styles.smallCard} ${styles.whiteCard}`}>
                                    <img
                                        src={Photos.ItWorldIcon || 'https://via.placeholder.com/50'}
                                        alt=""
                                    />
                                    <h3>Мир IT</h3>
                                </div>
                            </div>

                            {/* Нижний ряд: Попробуй! (на всю ширину) */}
                            <div className={styles.tryBlock}>
                                <div className={styles.tryIcons}>
                                    <span className={styles.shape}>×</span>
                                    <span className={styles.shape}>△</span>
                                    <span className={styles.shape}>○</span>
                                </div>
                                <div className={styles.tryText}>
                                    <h4>Попробуй!</h4>
                                    <p>
                                        Пройди тест и узнай свои способности в сфере информационных
                                        технологий
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
