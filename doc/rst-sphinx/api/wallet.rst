=====================
Namespace: ``wallet``
=====================


.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   
Description
===========




.. _wallet.fromWord:


Function: ``fromWord``
======================



.. js:function:: fromWord(word)

    
    :param string word: <p>A string of mnemonic words</p>
    :return object: <p>Account object containing 4 keypairs, one from each of 4 shards</p>
    
.. _wallet.fromSeed:


Function: ``fromSeed``
======================



.. js:function:: fromSeed(seed)

    
    :param string seed: <p>A string of seed in base 58</p>
    :return object: <p>Account object containing 4 keypairs, one from each of 4 shards</p>
    
.. _wallet.distWord:


Function: ``distWord``
======================



.. js:function:: distWord(word, depth)

    
    :param string word: <p>A string of mnemonic words</p>
    :param number depth: <p>The number of addresses to discover</p>
    :return object: <p>Object containing shard distribution and address by index</p>
    
.. _wallet.distSeed:


Function: ``distSeed``
======================



.. js:function:: distSeed(seed, depth)

    
    :param string seed: <p>A string of seed in base 58</p>
    :param number depth: <p>The number of addresses to discover</p>
    :return object: <p>Object containing shard distribution and address by index</p>
    




