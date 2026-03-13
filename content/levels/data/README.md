# Level content (JSON)

Each file is a level. To add a new level:

1. Create `{id}-{slug}.json` (e.g. `12-nip-whatever.json`)
2. Add one import in `../load.ts`

## Schema

```json
{
  "id": 1,
  "name": "Level Name",
  "description": "Short description",
  "track": "basics" | "nips" | "kinds",
  "quiz": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C"],
      "correct": 0,
      "explanation": "Why this answer is correct."
    }
  ]
}
```

- `correct`: 0-based index of the correct option
- Quiz questions are shuffled at runtime
