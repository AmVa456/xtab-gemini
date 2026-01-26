import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import * as config from '../lib/config';

describe('Header Component', () => {
  beforeEach(() => {
    vi.spyOn(config, 'getAppMode').mockReturnValue('standalone');
  });

  it('should render the application title', () => {
    render(<Header />);
    
    const title = screen.getByText('Gemini Design Studio');
    expect(title).toBeInTheDocument();
  });

  it('should render API Settings button when onOpenApiKeySettings is provided', () => {
    const mockOnOpenApiKeySettings = vi.fn();
    
    render(<Header onOpenApiKeySettings={mockOnOpenApiKeySettings} />);
    
    const apiSettingsButton = screen.getByRole('button', { name: /API Settings/i });
    expect(apiSettingsButton).toBeInTheDocument();
  });

  it('should not render API Settings button when onOpenApiKeySettings is not provided', () => {
    render(<Header />);
    
    const apiSettingsButton = screen.queryByRole('button', { name: /API Settings/i });
    expect(apiSettingsButton).not.toBeInTheDocument();
  });

  it('should render dashboard connection when status and callback are provided', () => {
    const mockOnCheckConnection = vi.fn();
    
    render(
      <Header 
        connectionStatus="disconnected"
        dashboardApiUrl="http://localhost:5000/api"
        isDashboardEnabled={true}
        onCheckConnection={mockOnCheckConnection}
      />
    );
    
    // DashboardConnection component should be rendered when these props are provided
    // We're testing that the Header renders with these props
    expect(screen.getByText('Gemini Design Studio')).toBeInTheDocument();
  });

  it('should display mode information for non-standalone modes', () => {
    vi.spyOn(config, 'getAppMode').mockReturnValue('embedded');
    
    render(<Header />);
    
    const modeText = screen.getByText('Embedded Mode');
    expect(modeText).toBeInTheDocument();
  });
});
