import logging
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
import jwt
from src.config import Config

passwd_context = CryptContext(
    schemes=['bcrypt'],
    bcrypt__rounds=12
)

ACCESS_TOKEN_EXPIRY = 3600 * 24

def generate_password_hash(password: str) -> str:
    return passwd_context.hash(password)

def verify_password(password: str, hash: str) -> bool:
    return passwd_context.verify(password, hash)

def create_access_token(user_data: dict, expiry: timedelta = None):
    payload = {}
    payload['user_id'] = user_data.get('user_id')
    payload['email'] = user_data.get('email')
    payload['exp'] = datetime.now(tz=timezone.utc) + (expiry if expiry is not None else timedelta(seconds=ACCESS_TOKEN_EXPIRY))
    token = jwt.encode(
        payload=payload,
        key=Config.JWT_SECRET,
        algorithm=Config.JWT_ALGORITHM
    )
    return token

def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(
            jwt=token,
            key=Config.JWT_SECRET,
            algorithms=[Config.JWT_ALGORITHM]
        )
    except jwt.PyJWTError as e:
        logging.exception(e)
        return None