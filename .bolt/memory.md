# Project memory

## Product intent & audience

- Suite of browser-based PDF tools (merge, watermark, compress, protect, and others) for end users who want quick PDF operations without uploading files.
- Audience values privacy and speed; all processing is client-side, no server uploads.

## Brand personality & voice

- Practical and direct; copy emphasizes privacy (“No uploads”, “Runs locally”) and immediacy.
- Release notes are concise, outcome-focused, and flag trade-offs honestly.

## Visual design & UX direction

- Static-export Next.js app; each tool has a dedicated route (e.g. `/merge-pdf`, `/compress-pdf`).
- Tool pages: title → upload/drop zone first → feature cards below, so users can act immediately.
- Homepage: compact header → tools/upload area high up → feature cards below.
- Shared tool component pattern (UI + page wrapper + route + nav entry + SEO tool list + sitemap entry).
- Upload UX uses a file drop zone component reused across tools.

## Decisions, constraints & rationale

- Static export requires explicit clean-URL mappings and matching generated file structure; without it, deep-link reloads 404. Fix applied via routing config and build output setup.
- Compress PDF offers three levels: Less, Recommended, Extreme. Reduces size by rasterizing each page to a high-quality image inside the PDF. Trade-off: text no longer selectable/searchable in compressed output; acceptable and standard for browser-based compressors.
- Compression helper includes a page-to-JPEG rasterizer built against the pdfjs document (not a page proxy).
- Helper modules (e.g. `protectPdf`, watermark loop, compression) live in shared library files; signature/variable correctness is a recurring risk when editing—double-check after edits.
- Type check + full build used as verification gate after changes.

## Open questions & assumptions

- Deploy target is assumed to support the configured clean-URL mappings; redeploy required for routing fix to take effect.
- No explicit user `.bolt/prompt` exists yet; global instructions may be added later.
- Compress output fidelity at “Extreme” level not user-validated; may need tuning if quality complaints arise.