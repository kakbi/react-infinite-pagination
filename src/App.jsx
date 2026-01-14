import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import birdPlaceholder from '../assets/img/bird.jpg';

const LIMIT = 10;
const API_URL = 'https://jsonplaceholder.typicode.com/photos';

function App() {
    const [photos, setPhotos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const fetchPhotos = useCallback(async () => {
        if (isLoading) return;
        if (totalCount && photos.length >= totalCount) return;

        setIsLoading(true);

        try {
            const response = await axios.get(API_URL, {
                params: {
                    _limit: LIMIT,
                    _page: currentPage,
                },
            });

            setPhotos((prev) => [...prev, ...response.data]);
            setCurrentPage((prev) => prev + 1);
            setTotalCount(Number(response.headers['x-total-count']));
        } catch (error) {
            console.error('Failed to load photos:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, photos.length, totalCount, currentPage]);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const scrollHandler = useCallback(() => {
        const { scrollTop, scrollHeight } = document.documentElement;

        if (
            scrollHeight - (scrollTop + window.innerHeight) < 100 &&
            photos.length < totalCount &&
            !isLoading
        ) {
            fetchPhotos();
        }
    }, [fetchPhotos]);

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);

        return () => {
            document.removeEventListener('scroll', scrollHandler);
        };
    }, [scrollHandler]);

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
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = birdPlaceholder;
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

export default App;
