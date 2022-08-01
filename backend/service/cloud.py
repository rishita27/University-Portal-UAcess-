"""Cloud Services.

Authors:
    * Aasif Faizal <aasif@dal.ca>

This service interacts with the cloud provider.
"""

import boto3
from botocore.exceptions import ClientError

s3 = boto3.resource('s3')


def get_file(bucket: str, key: str):
    """This service fetches a file from a given bucket in the using its key.

    Args:
        bucket (str): The bucket name from which the file should be fetched.
        key (str): The key by which the file can be identified in the bucket.

    Returns:
        The required file fetched from the cloud.
    """
    try:
        content = s3.Bucket(bucket).Object(key).get()['Body']
    except ClientError as e:
        content = None
    return content


def upload_file(bucket: str, key: str, file_content: bytes):
    """This service creates a new file at a given location in the cloud bucket.
    Args:
        bucket (str): The name of the bucket where the file needs to be uploaded.
        key (str): The path at which the file needs to be uploaded within the bucket.
        file_content: The contents of the file/
    """
    s3.Bucket(bucket).Object(key).put(Body=file_content)
