__author__ = "Dale Hartman"
__date__ = "July 21, 2016 3:38:40 PM$"

import numpy as np

class ColorSearcher:
    def __init__(self, index):
        # store the index we are reading through
        self.index = index

    def search(self, queryFeatures):
        """
        Take the descriptor of our search image and compute
        the best matching images from the index
        """

        # initialize the dictionary of results
        results = {}

        # loop over the index
        for (k, features) in self.index.items():
            # compute the chi-squared distance between the features
            # in our index and our query features
            d = self.chi2_distance(features, queryFeatures)

            # now update the results dictionary with that result
            results[k] = d

        # sort the results, so that the more relevant results
        # (smaller numbers) are at the front of the list
        results = sorted([(v, k) for (k,v) in results.items()])

        # return the results
        return results

    def chi2_distance(self, histA, histB, eps = 1e-10):
        # compute the chi-squared distance
        d = 0.5 * np.sum([((a-b) ** 2) / (a + b + eps)
            for (a, b) in zip(histA, histB)])

        # return the chi-squared distance
        return d