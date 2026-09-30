import { describe, it, expect } from 'vitest';
import { filterJobsByTitle, sortByNewest, formatPostedDate } from './jobs';
import type { Job } from '../types/job';

function makeJob(slug: string, postedDate: string): Job {
    return {
        slug,
        title: `Role ${slug}`,
        department: 'Technology',
        location: 'Remote',
        type: 'Full-time',
        remote: true,
        postedDate,
        summary: 'A role.',
    };
}

describe('sortByNewest', () => {
    it('orders jobs by posted date, newest first', () => {
        const jobs = [
            makeJob('a', '2027-01-01'),
            makeJob('b', '2027-03-15'),
            makeJob('c', '2027-02-10'),
        ];
        expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
    });

    it('does not mutate the input array', () => {
        const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
        const original = jobs.map((j) => j.slug);
        sortByNewest(jobs);
        expect(jobs.map((j) => j.slug)).toEqual(original);
    });
});

describe('filterJobsByTitle', () => {
    it('matches partial titles without changing their order', () => {
        const jobs = [
            { ...makeJob('first', '2027-01-01'), title: 'Senior Frontend Engineer' },
            { ...makeJob('second', '2027-02-01'), title: 'Clinical Research Scientist' },
            { ...makeJob('third', '2027-03-01'), title: 'Frontend Platform Engineer' },
        ];

        expect(filterJobsByTitle(jobs, '  engineer  ').map((job) => job.slug)).toEqual([
            'first',
            'third',
        ]);
    });

    it('matches titles case-insensitively', () => {
        const jobs = [{ ...makeJob('scientist', '2027-01-01'), title: 'Clinical Research Scientist' }];

        expect(filterJobsByTitle(jobs, 'SCIENTIST')).toEqual(jobs);
    });

    it('returns no jobs when the query does not match', () => {
        const jobs = [{ ...makeJob('engineer', '2027-01-01'), title: 'Data Platform Engineer' }];

        expect(filterJobsByTitle(jobs, 'marketing')).toEqual([]);
    });

    it('returns all jobs for empty and whitespace-only queries', () => {
        const jobs = [makeJob('first', '2027-01-01'), makeJob('second', '2027-02-01')];

        expect(filterJobsByTitle(jobs, '')).toEqual(jobs);
        expect(filterJobsByTitle(jobs, '   ')).toEqual(jobs);
    });

    it('does not mutate the input array', () => {
        const jobs = [
            { ...makeJob('first', '2027-01-01'), title: 'Senior Frontend Engineer' },
            { ...makeJob('second', '2027-02-01'), title: 'Financial Analyst' },
        ];
        const originalJobs = [...jobs];

        filterJobsByTitle(jobs, 'frontend');

        expect(jobs).toEqual(originalJobs);
    });
});

describe('formatPostedDate', () => {
    it('formats an ISO date as a readable string', () => {
        expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
    });

    it('returns the raw value when the date is unparseable', () => {
        expect(formatPostedDate('not-a-date')).toBe('not-a-date');
    });
});
