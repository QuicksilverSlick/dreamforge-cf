/**
 * Tests for README.md parser utility
 */

import { describe, it, expect } from 'vitest';
import {
    extractProjectNameFromReadme,
    extractReadmeMetadata,
    getProjectDisplayName
} from '../../worker/utils/readmeParser';

describe('readmeParser', () => {
    describe('extractProjectNameFromReadme', () => {
        it('should extract project name from H1 heading', () => {
            const readme = `# My Awesome Project

This is a description.`;
            const name = extractProjectNameFromReadme(readme);
            expect(name).toBe('My Awesome Project');
        });

        it('should extract project name and remove badges', () => {
            const readme = `# ![CI](https://img.shields.io/badge/ci-passing-green) My Project ![Version](https://img.shields.io/badge/version-1.0.0-blue)

Description here.`;
            const name = extractProjectNameFromReadme(readme);
            expect(name).toBe('My Project');
        });

        it('should extract project name and remove markdown links', () => {
            const readme = `# [My Project](https://example.com)

Description here.`;
            const name = extractProjectNameFromReadme(readme);
            expect(name).toBe('My Project');
        });

        it('should extract project name and remove emoji', () => {
            const readme = `# 🚀 My Project 🎉

Description here.`;
            const name = extractProjectNameFromReadme(readme);
            expect(name).toBe('My Project');
        });

        it('should extract project name and remove bold/italic formatting', () => {
            const readme = `# **My** _Awesome_ Project

Description here.`;
            const name = extractProjectNameFromReadme(readme);
            expect(name).toBe('My Awesome Project');
        });

        it('should extract project name and remove inline code', () => {
            const readme = `# My \`awesome\` Project

Description here.`;
            const name = extractProjectNameFromReadme(readme);
            expect(name).toBe('My awesome Project');
        });

        it('should return null if no H1 heading found', () => {
            const readme = `## My Project

This is a description.`;
            const name = extractProjectNameFromReadme(readme);
            expect(name).toBeNull();
        });

        it('should return null for empty content', () => {
            const name = extractProjectNameFromReadme('');
            expect(name).toBeNull();
        });

        it('should return null for undefined content', () => {
            const name = extractProjectNameFromReadme(undefined);
            expect(name).toBeNull();
        });

        it('should skip empty lines and extract first H1', () => {
            const readme = `

# My Project

Description here.`;
            const name = extractProjectNameFromReadme(readme);
            expect(name).toBe('My Project');
        });
    });

    describe('extractReadmeMetadata', () => {
        it('should extract project name and description', () => {
            const readme = `# My Project

A cool description of my project.

## Features
- Feature 1`;
            const metadata = extractReadmeMetadata(readme);
            expect(metadata.projectName).toBe('My Project');
            expect(metadata.description).toBe('A cool description of my project.');
            expect(metadata.headingLevel).toBe(1);
        });

        it('should skip badge lines when looking for description', () => {
            const readme = `# My Project

![CI](https://img.shields.io/badge/ci-passing-green) ![Version](https://img.shields.io/badge/version-1.0.0-blue)

A cool description of my project.`;
            const metadata = extractReadmeMetadata(readme);
            expect(metadata.projectName).toBe('My Project');
            expect(metadata.description).toBe('A cool description of my project.');
        });

        it('should return null values if no H1 found', () => {
            const readme = `## Not a main heading

Some text.`;
            const metadata = extractReadmeMetadata(readme);
            expect(metadata.projectName).toBeNull();
            expect(metadata.description).toBeNull();
            expect(metadata.headingLevel).toBeNull();
        });
    });

    describe('getProjectDisplayName', () => {
        it('should prefer README name over repository name', () => {
            const readme = `# Beautiful Project Name

Description`;
            const displayName = getProjectDisplayName(readme, 'user/ugly-repo-name');
            expect(displayName).toBe('Beautiful Project Name');
        });

        it('should fall back to repository name if no H1 in README', () => {
            const readme = `## Some heading

Description`;
            const displayName = getProjectDisplayName(readme, 'user/my-repo');
            expect(displayName).toBe('my-repo');
        });

        it('should fall back to repository name if README is empty', () => {
            const displayName = getProjectDisplayName('', 'user/my-repo');
            expect(displayName).toBe('my-repo');
        });

        it('should fall back to repository name if README is undefined', () => {
            const displayName = getProjectDisplayName(undefined, 'user/my-repo');
            expect(displayName).toBe('my-repo');
        });

        it('should strip owner prefix from repository name', () => {
            const displayName = getProjectDisplayName(undefined, 'octocat/Hello-World');
            expect(displayName).toBe('Hello-World');
        });

        it('should handle repository name without owner', () => {
            const displayName = getProjectDisplayName(undefined, 'standalone-repo');
            expect(displayName).toBe('standalone-repo');
        });
    });

    describe('complex README examples', () => {
        it('should handle real-world Cloudflare Workers README', () => {
            const readme = `# [![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com) **Dreamforge** - AI Code Generation Platform

> Build full-stack applications using AI-powered code generation

This is the official Cloudflare Workers implementation.`;
            const name = extractProjectNameFromReadme(readme);
            expect(name).toBe('Dreamforge - AI Code Generation Platform');
        });

        it('should handle GitHub-style README with badges', () => {
            const readme = `# My Project

A comprehensive project management tool.

[![CI](https://github.com/user/repo/workflows/CI/badge.svg)](https://github.com/user/repo/actions)
[![Version](https://img.shields.io/npm/v/my-project.svg)](https://npmjs.org/package/my-project)
[![Downloads](https://img.shields.io/npm/dm/my-project.svg)](https://npmjs.org/package/my-project)`;
            const metadata = extractReadmeMetadata(readme);
            expect(metadata.projectName).toBe('My Project');
            expect(metadata.description).toBe('A comprehensive project management tool.');
        });
    });
});
