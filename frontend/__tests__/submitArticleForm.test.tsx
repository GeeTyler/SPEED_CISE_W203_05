import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SubmitArticleForm from '../app/components/submit-article/submitArticleForm';
import axios from 'axios';

jest.mock('axios');

describe('SubmitArticleForm', () => {
  it('renders the form', () => {
    render(<SubmitArticleForm />);
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Authors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Journal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/DOI/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Publisher/i)).toBeInTheDocument();
  });

  it('submits the form', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { title: 'Test Article' } });

    render(<SubmitArticleForm />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Article' } });
    fireEvent.change(screen.getByLabelText(/Authors/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Journal/i), { target: { value: 'Test Journal' } });
    fireEvent.change(screen.getByLabelText(/Year/i), { target: { value: '2023' } });
    fireEvent.change(screen.getByLabelText(/DOI/i), { target: { value: '10.1234/test' } });
    fireEvent.change(screen.getByLabelText(/Publisher/i), { target: { value: 'Test Publisher' } });

    fireEvent.click(screen.getByText(/Submit Article/i));

    expect(await screen.findByText(/Article submitted successfully!/i)).toBeInTheDocument();
  });
});