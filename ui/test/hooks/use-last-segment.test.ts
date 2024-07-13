import { renderHook } from "@testing-library/react"
import useLastSegment from "../../src/hooks/use-last-segment";
import { useLocation } from 'react-router-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Preserve other exports
    useLocation: jest.fn(), // Mock useLocation
}));

const mockedUseLocation = useLocation as jest.Mock;

describe('useLastSegment', () => {
    it('should return an empty string for an empty path', () => {
        mockedUseLocation.mockReturnValue({
            pathname: ''
        });
        const { result } = renderHook(() => useLastSegment())
        expect(result.current).toBe('')
    })

    it('should return the last segment for a path with multiple segments', () => {
        mockedUseLocation.mockReturnValue({
            pathname: '/foo/bar/baz'
        });
        const { result } = renderHook(() => useLastSegment())
        expect(result.current).toBe('baz')
    })

    it('should handle paths with trailing slashes', () => {
        mockedUseLocation.mockReturnValue({
            pathname: '/foo/bar'
        });
        const { result } = renderHook(() => useLastSegment())
        expect(result.current).toBe('bar')
    })

    it('should handle paths with only one segment', () => {
        mockedUseLocation.mockReturnValue({
            pathname: '/foo'
        });
        const { result } = renderHook(() => useLastSegment())
        expect(result.current).toBe('foo')
    })

    it('should handle paths with special characters', () => {
        mockedUseLocation.mockReturnValue({
            pathname: '/foo/bar-baz_qux'
        });
        const { result } = renderHook(() => useLastSegment())
        expect(result.current).toBe('bar-baz_qux')
    })

    it('should handle paths with URL-encoded characters', () => {
        mockedUseLocation.mockReturnValue({
            pathname: '/foo/bar%20baz'
        });
        const { result } = renderHook(() => useLastSegment())
        expect(result.current).toBe('bar%20baz')
    })

    it('should return an empty string for a path with only a slash', () => {
        mockedUseLocation.mockReturnValue({
            pathname: '/'
        });
        const { result } = renderHook(() => useLastSegment())
        expect(result.current).toBe('')
    })
})
