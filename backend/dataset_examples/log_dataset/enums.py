from enum import Enum

class ClassificationLabel(Enum):
    Apache = 'Apache'
    Hadoop = 'Hadoop'
    HDFS = 'HDFS'
    Linux = 'Linux'
    Mac = 'Mac'
    OpenSSH = 'OpenSSH'
    Proxifier = 'Proxifier'
    Spark = 'Spark'
    Windows = 'Windows'
    Zookeper = 'Zookeper'

class NerLabel(Enum):
    DateTime = 'DateTime'
    Level = 'Level'
    Process = 'Process' # Process or ProcessId
    User = 'User'
    Node = 'Node'
    Component = 'Component'
    Content = 'Content'