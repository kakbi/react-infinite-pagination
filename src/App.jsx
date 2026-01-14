import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

import birdPlaceholder from '../assets/img/bird.jpg';

function App() {
    const [photos, setPhotos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [fetching, setFetching] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        if (fetching) {
            console.log('fetching');
            axios
                .get(
                    `https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage}`
                )
                .then((response) => {
                    setPhotos([...photos, ...response.data]);
                    setCurrentPage((prevState) => prevState + 1);
                    setTotalCount(response.headers['x-total-count']);
                })
                .finally(() => setFetching(false));
        }
    }, [fetching]);

    const scrollHandler = (e) => {
        if (
            e.target.documentElement.scrollHeight -
                (e.target.documentElement.scrollTop + window.innerHeight) <
                100 &&
            photos.length >= totalCount
        )
            setFetching(true);
    };

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);

        return function () {
            document.removeEventListener('scroll', scrollHandler);
        };
    }, []);

    return (
        <div className="container">
            {photos.map((photo) => (
                <div className="photo" key={photo.id}>
                    <div className="title">
                        {photo.id}. {photo.title}
                    </div>
                    <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = birdPlaceholder;
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

export default App;
