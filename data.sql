-- Add a new column friends_count to the users table
ALTER TABLE users
ADD COLUMN friends_count INTEGER DEFAULT 0;

-- Create a trigger function to update friends_count
CREATE OR REPLACE FUNCTION update_friends_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment friends_count when a new friendship is added
    IF TG_OP = 'INSERT' THEN
        UPDATE users
        SET friends_count = friends_count + 1
        WHERE user_id = NEW.user1_id OR user_id = NEW.user2_id;
    -- Decrement friends_count when a friendship is deleted
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users
        SET friends_count = friends_count - 1
        WHERE user_id = OLD.user1_id OR user_id = OLD.user2_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to execute the trigger function after insert or delete operations on the friends table
CREATE TRIGGER update_friends_count_trigger
AFTER INSERT OR DELETE ON friends
FOR EACH ROW
EXECUTE FUNCTION update_friends_count();