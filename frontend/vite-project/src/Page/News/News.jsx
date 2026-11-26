import { useParams } from 'react-router-dom';
import { news, resources } from '../../content';
import { Breadcrumbs, Missing, Tiles } from '../../Shared/Blocks';

const collections = {
    news: { title: 'Новости ХОД Future Academy', label: 'Новости', items: news },
    knowledge: { title: 'База знаний', label: 'База знаний', items: resources },
};

export default function News({ collection = 'news' }) {
    const { title, label, items } = collections[collection];
    const { id } = useParams();
    const base = '/' + collection;

    if (id) {
        const article = items.find((item) => item.id === id);
        if (!article) return <Missing title="Материал не найден" to={base} link={label} />;
        return <div className="shell page-stack">
            <Breadcrumbs items={ [[label, base], [article.title]] } />
            <article className="article">
                <div className={`article-cover tone-${article.color}`}><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p>{article.intro}</p></div>
                {article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </article>
        </div>;
    }
    return <div className="shell page-stack">
        <Breadcrumbs items={ [[label]] } /><h1>{title}</h1>
        <Tiles items={items} base={base} />
    </div>;
}
