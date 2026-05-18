"""
Database initialization script to ensure email column has UNIQUE constraint
Run this once to set up the database schema properly.
"""
import MySQLdb
from config import Config

def init_database():
    """Create database and tables if they don't exist, with proper constraints."""
    try:
        conn = MySQLdb.connect(
            host=Config.MYSQL_HOST,
            user=Config.MYSQL_USER,
            passwd=Config.MYSQL_PASSWORD,
            charset="utf8mb4"
        )
        cur = conn.cursor()

        # Create database if not exists
        cur.execute(f"CREATE DATABASE IF NOT EXISTS {Config.MYSQL_DB}")
        cur.execute(f"USE {Config.MYSQL_DB}")

        # Create users table with UNIQUE constraint on email
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)

        # Check if email index exists, if not create it
        cur.execute(f"""
            SELECT COUNT(*) as index_count 
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_NAME='users' 
            AND COLUMN_NAME='email' 
            AND INDEX_NAME!='PRIMARY'
            AND TABLE_SCHEMA='{Config.MYSQL_DB}'
        """)
        
        result = cur.fetchone()
        if result and result[0] == 0:
            # Index doesn't exist on email, add UNIQUE constraint
            try:
                cur.execute("ALTER TABLE users ADD UNIQUE KEY unique_email (email)")
                print("✓ Added UNIQUE constraint on email column")
            except MySQLdb.Error as e:
                if "Duplicate entry" in str(e):
                    print("⚠ Duplicate entries found in email column. Please clean up data.")
                else:
                    print(f"✓ UNIQUE constraint already exists on email: {e}")

        conn.commit()
        cur.close()
        conn.close()
        print("✓ Database initialization completed successfully")

    except Exception as e:
        print(f"✗ Database initialization failed: {e}")
        raise

if __name__ == "__main__":
    init_database()
