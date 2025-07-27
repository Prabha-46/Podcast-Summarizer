from dotenv import load_dotenv
import os
import boto3
from botocore.exceptions import ClientError
from typing import BinaryIO
from botocore.config import Config

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

s3_config = Config(signature_version="s3v4")
s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    config=s3_config
)

def generate_presigned_url(s3_path: str, expires_in: int = 3600) -> str:
    try:
        print(f"Key: '{s3_path}' (length: {len(s3_path)})")
        print("Byte values:", list(s3_path.encode()))
        url = s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": S3_BUCKET_NAME, "Key": s3_path},
        ExpiresIn=expires_in
        )
        return url
    except ClientError as e:
        print(f"Presign error: {e}")
    return None

def upload_file(file_path: str, s3_path: str) -> bool:
    try:
        s3_client.upload_file(file_path, S3_BUCKET_NAME, s3_path)
    except ClientError as e:
        print(f"Upload error: {e}")
        return False
    return True