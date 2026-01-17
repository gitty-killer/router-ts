# router-ts

Route table registry.

## Overview
This project provides a small, well-scoped CLI and library to manage domain records using
a simple line-based storage format. Each record is validated against a fixed schema.

## Data format
Each line in `data/store.txt` is a record with key/value pairs separated by `|`:

`field1=value1|field2=value2|...`

- Fields: method, path, target
- Numeric field: none
- `|` is not allowed in values (use `/` instead).

## Commands
- `init` initializes the store file
- `add key=value ...` adds a record
- `list` prints all records
- `summary` prints count and numeric totals (if defined)

## Example
add method=demo path=sample
list
summary

## Structure
- `src/` implementation
- `data/` runtime store (gitignored)
- `README.md` usage and format
