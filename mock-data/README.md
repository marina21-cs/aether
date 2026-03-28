# AETHER Mock CSV Files

These files can be uploaded through `Dashboard > Data Import`.

- `aether_mock_holdings.csv`: standard holdings export format.
- `aether_mock_bank_export.csv`: bank/broker position style format with different headers.
- `aether_mock_holdings_incremental_batch_2.csv`: second upload batch with overlap + new rows to test append behavior.
- `aether_mock_bank_export_batch_2.csv`: additional bank-style payload for repeat import tests.
- `aether_mock_tangible_assets.csv`: tangible asset examples for mixed portfolio ingestion.

Both are supported by the new flexible CSV parser and AI-assisted import endpoint.

Suggested repeat-upload test flow:

1. Upload `aether_mock_holdings.csv`, then click `Add Parsed Holdings`.
2. Add one manual stock in Holdings.
3. Upload `aether_mock_holdings_incremental_batch_2.csv`, then click `Add Parsed Holdings`.
4. Confirm manual stock is still present and imported holdings were appended/merged.
5. Upload `aether_mock_bank_export_batch_2.csv` and `aether_mock_tangible_assets.csv` for additional parser coverage.
