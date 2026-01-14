import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

import birdPlaceholder from '../assets/img/bird.jpg';

function App() {
    const [photos, setPhotos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (fetching) {
            axios
                .get(
                    'https://jsonplaceholder.typicode.com/photos?_limit=10&_page=1'
                )
                .then((response) => setPhotos(response.data));
        }
    }, [fetching]);

    const scrollHandler = (e) => {
        console.log('scroll');
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

            <div className="loading-marker">Loading new cards...</div>
        </div>
    );
}

export default App;
