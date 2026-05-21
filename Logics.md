## Logic for handling product submit form

1. Take input values (name, price, image…)
2. Send them to api
3. api saves:
   - image → storage (generate imageUrl from image storage)
   - data → database (imageUrl is added to the data so it can be added in database
4. Return success
