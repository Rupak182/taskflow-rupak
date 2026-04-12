from fastapi.security import HTTPBearer
from fastapi import HTTPException, status, Depends
from .utils import decode_token
from starlette.requests import Request

class TokenBearer(HTTPBearer):
    def __init__(self):
        super().__init__(auto_error=False)

    async def __call__(self, request: Request):
        creds = await super().__call__(request)
        if not creds:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing token")
        
        token = creds.credentials
        token_data = decode_token(token)
        if not token_data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

        return token_data

access_token_bearer = TokenBearer()
