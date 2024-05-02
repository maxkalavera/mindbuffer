Unit tests are executed using selenium as the driver.

## List of tests
There are unit tests for the next operations

### CRUDS 
Create Note
Create Notepad
Create Page

Remove Note
Remove Notepad
Remove Page

Update Notepad name
Update Page name

List notes
  - notes are displayed
  - notes are paginated
List notepads
  - notepads are displayed
  - notepads are paginated
List pages
  - pages are displayed
  - pages are paginated

# Miscellaneous
Search filters
Clear serach filters

## Components testing identifiers
This indentifiers are added to the components only when packaging the app with the testing enviroment.
The slags at the end are generated using Alpha Numeric generator, to generate 10 characters length slags.

### Notes
TextArea for create note: `id:create-note-textarea:ZtAZE54FsV`
Send button to create note: `id:create-note-button:j2OnOhuazV`
Notes board: `id:notes-board:Y8FAln8HKV`
Text note: `class:text-note:7BoiMerq5D`
Text note's options button: `class:note-options-button:TMKI1oxDBJ`
Text note's options delete button: `class:note-options-delete-button:CEXEVxvbnV`

## Notepads
Create notepads button: `id:create-notepad-button:f9CFxx4pON`
Create/Update Notepad modal's name input: `class:create-notepad-name-input:hWmi28rONe`
Notepad options Button: `class:notepad-options-button:GrWzrbooC9`
Notepad option's edit button: `class:notepad-options-edit-button:OJSSF5T46S`
Notepad option's delete button: `class:notepad-options-delete-button:r6ukcuDrQL`
Notepads list container: `id:notepad-list-container:7MLMomsYBt`
Notepad: `class:notepad:8iwbWkd5Y1`

## Pages
Create/Update page modal's name input: `class:page-modal-name-input-wrapper:o0Tmq3A18Z`
Notepad option's create page button: `class:notepad-options-create-page-button:LLAk9dX9bP`
Page options button: `class:page-options-button:WvlSIUCzRC`
Page option's edit page button: `class:page-options-edit-button:1bWdLl8T87`
Page option's delete button: `class:page-options-delete-button:excgDO3li2`
Page: `class:page:8o3bzP8yoT`

### Modals
Cancel button: `class:8574d9c791c54ac387a0eadeb60ad9e9` `class:modal-cancel-button:64CdoMr82v`
Confirm button: `class:6012f7869d934c888ac9711da2eb0db7` `class:modal-confirm-button:fHIbu0jVfe`

### search
Search input `id:searchbar-input:aPNkesepop`
Send search button `id:searchbar-send-button:OGUB40c5DM`
Clear search button `id:searchbar-clear-button:KlsiLQF3zr`