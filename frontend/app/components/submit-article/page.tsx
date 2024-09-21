import React from 'react';

const SubmitArticlePage: React.FC = () => {
    return (
        <div>
            <h1>Submit Article</h1>
            <form>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" required />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea id="content" name="content" required></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SubmitArticlePage;