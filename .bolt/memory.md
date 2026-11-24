# Project memory

## Product intent & audience

- PDF manipulation web app built with Next.js
- Core tools include: Split, Extract, Delete, Rotate, Redact
- Audience: general users needing quick PDF editing in-browser without installing software

## Brand personality & voice

- Natural, direct, human-sounding copy
- Avoid stiff, formulaic AI phrasing in content pages
- Replace overly formal wording with concise, conversational language

## Visual design & UX direction

- Tool pages use thumbnail-based page selection (click to select)
- Buttons should have short explanatory text below labels to clarify distinct actions
- Action buttons should show dynamic counts (e.g. "Extract 5 pages")
- Conditional buttons appear only when relevant (e.g. "Delete selected" only when pages are selected)

## Decisions, constraints & rationale

- PDF data stored and passed as `Uint8Array` throughout the pipeline, not raw `ArrayBuffer`
- Avoid `out.buffer.slice(0)` on `Uint8Array` — can produce misaligned buffer pdf-lib can't parse on subsequent operations
- pdf-lib utility functions accept `ArrayBuffer | Uint8Array` signatures
- Fresh `ArrayBuffer` view created only when needed for pdf.js rendering
- React thumbnail keys: be careful with page renumbering after delete — using `key={t.page}` causes conflicts when pages are renumbered
- Three distinct PDF actions: Extract (selected pages → single PDF), Split all (each page → separate PDFs in ZIP), Delete selected (remove from working file)

## Open questions & assumptions

- Whether additional tools beyond Split/Extract/Delete/Rotate/Redact are planned
- Whether ZIP download for split uses a specific library (assumed implemented)
- Rotation and Redact tools may need similar `Uint8Array` audit for consistency